defmodule Climbing.Health do
  @moduledoc """
  Whether the application can do its job right now.
  """

  alias Climbing.Repo

  @probe_timeout_ms 1_000

  @type check :: :up | :down
  @type report :: %{status: :ok | :degraded, checks: %{database: check()}}

  @doc """
  Check every dependency and summarises the result.
  """
  @spec check(timeout()) :: report()
  def check(timeout_ms \\ @probe_timeout_ms) do
    checks = %{database: database_check(timeout_ms)}
    %{status: overall(checks), checks: checks}
  end

  defp database_check(timeout_ms) do
    case within(ping(), timeout_ms) do
      {:ok, _result} -> :up
      _failure -> :down
    end
  end

  # Runs `fun` in its own process and gives up after `timeout_ms`.
  #
  # async_nolink: if the probe crashes we get {:exit, reason} back instead of dying with it.
  defp within(fun, timeout_ms) do
    task = Task.Supervisor.async_nolink(Climbing.TaskSupervisor, fun)

    case Task.yield(task, timeout_ms) || Task.shutdown(task, :brutal_kill) do
      {:ok, result} -> result
      {:exit, reason} -> {:error, {:exit, reason}}
      nil -> {:error, :timeout}
    end
  end

  defp overall(checks) do
    if Enum.all?(checks, fn {_name, result} -> result == :up end), do: :ok, else: :degraded
  end

  # The one seam: the probe is looked up at call time so tests can replace it.
  # Real code never sets :health_ping, so production always runs ping_database/0.
  defp ping, do: Application.get_env(:climbing, :health_ping, &ping_database/0)

  defp ping_database, do: Repo.query("SELECT 1")
end
