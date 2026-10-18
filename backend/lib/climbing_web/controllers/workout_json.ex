defmodule ClimbingWeb.WorkoutJSON do
  @doc "Renders the workout details."
  def index(%{workouts: workouts}) do
    %{data: for(workout <- workouts, do: data(workout))}
  end

  def show(%{workout: workout}) do
    data(workout)
  end

  defp data(workout) do
    %{id: workout.id, performed_on: workout.performed_on, kind: workout.kind, notes: workout.notes}
  end
end
