defmodule ClimbingWeb.HealthController do
  use ClimbingWeb, :controller

  def index(conn, _params) do
    report = Climbing.Health.check()

    conn
    |> put_status(http_status(report))
    |> render(:index, report: report)
  end

  defp http_status(%{status: :ok}), do: :ok
  defp http_status(%{status: :degraded}), do: :service_unavailable
end
