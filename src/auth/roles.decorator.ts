import { SetMetadata } from '@nestjs/common';
import { UserRights } from 'src/user/entities/user.entity';

export const Roles = (roles: UserRights[]) => SetMetadata('roles', roles);
