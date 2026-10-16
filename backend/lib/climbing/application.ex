defmodule Climbing.Application do
  # See https://elixir.hexdocs.pm/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ClimbingWeb.Telemetry,
      Climbing.Repo,
      {DNSCluster, query: Application.get_env(:climbing, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Climbing.PubSub},
      # Runs short-lived tasks that must not take their caller down with them (see Climbing.Health)
      {Task.Supervisor, name: Climbing.TaskSupervisor},
      # Start a worker by calling: Climbing.Worker.start_link(arg)
      # {Climbing.Worker, arg},
      # Start to serve requests, typically the last entry
      ClimbingWeb.Endpoint
    ]

    # See https://elixir.hexdocs.pm/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Climbing.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ClimbingWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
