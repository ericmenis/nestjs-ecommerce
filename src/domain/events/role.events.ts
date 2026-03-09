/* eslint-disable prettier/prettier */
export class RoleAssignedToUserEvent {
  constructor(
    public readonly userId: number,
    public readonly roleId: number,
    public readonly assignedAt: Date,
  ) {}
}

export class RoleAssignRequestedEvent {
  constructor(public readonly userId: number, public readonly roleId: number) {}
}
