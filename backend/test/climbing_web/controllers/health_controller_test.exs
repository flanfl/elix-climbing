defmodule ClimbingWeb.HealthControllerTest do
  # async: false for the same reason as Climbing.HealthTest: the probe is swapped globally.
  use ClimbingWeb.ConnCase, async: false

  setup do
    on_exit(fn -> Application.delete_env(:climbing, :health_ping) end)
  end

  test "GET /api/health answers 200 when the database is up", %{conn: conn} do
    conn = get(conn, ~p"/api/health")

    assert json_response(conn, 200) == %{
             "status" => "ok",
             "checks" => %{"database" => "up"}
           }
  end

  test "GET /api/health answers 503 when the database is down", %{conn: conn} do
    Application.put_env(:climbing, :health_ping, fn -> {:error, :econnrefused} end)

    conn = get(conn, ~p"/api/health")

    assert json_response(conn, 503) == %{
             "status" => "degraded",
             "checks" => %{"database" => "down"}
           }
  end
end
