defmodule ClimbingWeb.WorkoutController do
  use ClimbingWeb, :controller

  def index(conn, _params) do
    workouts = Climbing.Training.list_workouts()
    render(conn, :index, workouts: workouts)
  end

  def show(conn, %{"id" => id}) do
    case Climbing.Training.get_workout(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> put_view(json: ClimbingWeb.ErrorJSON)
        |> render(:"404")
      workout -> render(conn, :show, workout: workout)
    end

  end
end
