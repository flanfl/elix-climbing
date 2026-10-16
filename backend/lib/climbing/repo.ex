defmodule Climbing.Repo do
  use Ecto.Repo,
    otp_app: :climbing,
    adapter: Ecto.Adapters.Postgres
end
