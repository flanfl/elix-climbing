defmodule Climbing.HealthTest do
  # async: false because we swap the database probe through the application environment,
  # which is global to the VM: two tests doing it at once would see each other's stub.
  use Climbing.DataCase, async: false

  alias Climbing.Health

  setup do
    on_exit(fn -> Application.delete_env(:climbing, :health_ping) end)
  end

  test "reports ok when the database answers" do
    assert Health.check() == %{status: :ok, checks: %{database: :up}}
  end

  test "reports degraded when the database does not answer" do
    Application.put_env(:climbing, :health_ping, fn -> {:error, :econnrefused} end)

    assert Health.check() == %{status: :degraded, checks: %{database: :down}}
  end

  test "reports degraded instead of hanging when the database is too slow" do
    # The stub blocks forever; only the deadline can end this call. 50 ms keeps the test fast.
    Application.put_env(:climbing, :health_ping, fn -> Process.sleep(:infinity) end)

    assert Health.check(50) == %{status: :degraded, checks: %{database: :down}}
  end

  @tag :capture_log
  test "reports degraded, and survives, when the probe crashes" do
    Application.put_env(:climbing, :health_ping, fn -> raise "boom" end)

    assert Health.check() == %{status: :degraded, checks: %{database: :down}}
  end
end
