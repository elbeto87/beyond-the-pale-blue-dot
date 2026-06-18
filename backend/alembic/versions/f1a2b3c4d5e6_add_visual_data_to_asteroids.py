"""add visual data to asteroids

Revision ID: f1a2b3c4d5e6
Revises: e5838d1ce582
Create Date: 2026-06-18 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'e5838d1ce582'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('asteroids', sa.Column('albedo', sa.Float(), nullable=True))
    op.add_column('asteroids', sa.Column('spectral_type', sa.String(), nullable=True))
    op.add_column('asteroids', sa.Column('rotation_period_hours', sa.Float(), nullable=True))
    op.add_column('asteroids', sa.Column('extent', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('asteroids', 'extent')
    op.drop_column('asteroids', 'rotation_period_hours')
    op.drop_column('asteroids', 'spectral_type')
    op.drop_column('asteroids', 'albedo')

