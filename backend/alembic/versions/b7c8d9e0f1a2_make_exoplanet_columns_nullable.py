"""make exoplanet columns nullable

Revision ID: b7c8d9e0f1a2
Revises: 125d235888c0
Create Date: 2026-07-22 16:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c8d9e0f1a2'
down_revision: Union[str, Sequence[str], None] = '125d235888c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Columns that should become nullable (everything except the primary key "name").
_NULLABLE_COLUMNS: list[tuple[str, sa.types.TypeEngine]] = [
    ("host_name", sa.String()),
    ("discovery_year", sa.Integer()),
    ("discovery_method", sa.String()),
    ("radius", sa.Float()),
    ("mass", sa.Float()),
    ("density", sa.Float()),
    ("temperature", sa.Float()),
    ("insolation", sa.Float()),
    ("orbit_period", sa.Float()),
    ("orbit_eccentricity", sa.Float()),
    ("orbit_smax", sa.Float()),
    ("star_temperature", sa.Float()),
]


def upgrade() -> None:
    """Upgrade schema."""
    for column_name, column_type in _NULLABLE_COLUMNS:
        op.alter_column("exoplanets", column_name, existing_type=column_type, nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    for column_name, column_type in _NULLABLE_COLUMNS:
        op.alter_column("exoplanets", column_name, existing_type=column_type, nullable=False)

