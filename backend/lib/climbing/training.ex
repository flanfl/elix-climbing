defmodule Climbing.Training do
  @moduledoc """
  Module handling workouts.
  """

  alias Climbing.Repo
  alias Climbing.Training.Workout
  alias Ecto.UUID

  @doc """
  List all available workouts.
  """
  @spec list_workouts :: [Workout.t()]
  def list_workouts do
    Repo.all(Workout)
  end

  @doc """
  Get single workout by id.
  """
  @spec get_workout(UUID.t()) :: Workout.t() | nil
  def get_workout(id) do
    Repo.get(Workout, id)
  end
end
