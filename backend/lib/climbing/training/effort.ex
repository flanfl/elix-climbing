defmodule Climbing.Training.Effort do
  @moduledoc false
  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "workout_efforts" do
    field :aspect, Ecto.Enum, values: [:fingers, :arms, :core, :legs]
    field :rpe, :integer
    field :minutes, :integer
    belongs_to :workout, Climbing.Training.Workout, type: :binary_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(effort, attrs) do
    effort
    |> cast(attrs, [:aspect, :rpe, :minutes])
    |> validate_required([:aspect, :rpe, :minutes])
    |> validate_number(:rpe, greater_than_or_equal_to: 1, less_than_or_equal_to: 10)
    |> validate_number(:minutes, greater_than_or_equal_to: 1)
    |> unique_constraint([:workout_id, :aspect])
  end
end
