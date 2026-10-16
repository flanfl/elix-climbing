defmodule ClimbingWeb.HealthJSON do
  @doc "Renders the report; atoms become JSON strings (`:ok` -> \"ok\")."
  def index(%{report: report}), do: %{status: report.status, checks: report.checks}
end
