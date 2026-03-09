/* eslint-disable prettier/prettier */
export class UserRoleAssignedEvent {
  constructor(
    public readonly userId: number,
    public readonly roleId: number,
    public readonly name: string,
    public readonly assignedAt: Date,
  ) {}
}

export class UserRegisteredEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly assignedAt: Date,
  ) {}
}

export class UserDetailsEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly assignedAt: Date,
  ) {}
}

export class UserLoggedInEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly loggedAt: Date,
  ) {}
}
