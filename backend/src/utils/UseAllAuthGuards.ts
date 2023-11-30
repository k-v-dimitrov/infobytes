import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrGuard } from '@nest-lab/or-guard';

export const UseAllAuthGuards = () =>
  UseGuards(
    OrGuard([AuthGuard('admin'), AuthGuard('jwt')], {
      throwOnFirstError: true,
    }),
  );
