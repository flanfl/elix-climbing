defmodule Climbing.Repo.Migrations.CreateWorkouts do
  use Ecto.Migration

  def change do
    create table(:workouts, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :performed_on, :date, null: false
      add :kind, :string, null: false
      add :notes, :text

      timestamps(type: :utc_datetime)
    end
  end
end
