defmodule Climbing.Repo.Migrations.CreateWorkoutEfforts do
  use Ecto.Migration

  def change do
    create table(:workout_efforts, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :aspect, :string, null: false
      add :rpe, :integer, null: false
      add :minutes, :integer, null: false

      add :workout_id, references(:workouts, on_delete: :delete_all, type: :binary_id),
        null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:workout_efforts, [:workout_id, :aspect])
  end
end
