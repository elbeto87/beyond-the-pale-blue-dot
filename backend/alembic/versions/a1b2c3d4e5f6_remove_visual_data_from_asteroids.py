"""remove visual data from asteroids

Revision ID: a1b2c3d4e5f6
Revises: f1a2b3c4d5e6
Create Date: 2026-06-19 10:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: str | Sequence[str] | None = 'f1a2b3c4d5e6'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column('asteroids', 'extent')
    op.drop_column('asteroids', 'rotation_period_hours')
    op.drop_column('asteroids', 'spectral_type')
    op.drop_column('asteroids', 'albedo')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('asteroids', sa.Column('albedo', sa.Float(), nullable=True))
    op.add_column('asteroids', sa.Column('spectral_type', sa.String(), nullable=True))
    op.add_column('asteroids', sa.Column('rotation_period_hours', sa.Float(), nullable=True))
    op.add_column('asteroids', sa.Column('extent', sa.String(), nullable=True))

