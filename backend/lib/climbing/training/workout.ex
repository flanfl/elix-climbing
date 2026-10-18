defmodule Climbing.Training.Workout do
  use Ecto.Schema
  import Ecto.Changeset
  alias Climbing.Training.Effort, as: Effort

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "workouts" do
    field :performed_on, :date
    field :kind, Ecto.Enum, values: [:bouldering, :lead, :hangboard, :conditioning]
    field :notes, :string
    has_many :efforts, Climbing.Training.Effort

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(workout, attrs) do
    workout
    |> cast(attrs, [:performed_on, :kind, :notes])
    |> cast_assoc(:efforts, with: &Effort.changeset/2)
    |> validate_required([:performed_on, :kind])
  end
end
