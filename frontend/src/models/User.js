// User Authentication Models

export const UserRole = {
  ADMIN: 'ROLE_ADMIN',
  STUDENT: 'ROLE_STUDENT', 
  TEACHER: 'ROLE_TEACHER',
  MENTOR: 'ROLE_MENTOR',
  DEPARTMENT: 'ROLE_DEPARTMENT'
};

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED'
};

// User Model
export class User {
  constructor({
    id = null,
    username = '',
    email = '',
    password = '',
    fullName = '',
    phone = '',
    address = '',
    roles = [],
    status = UserStatus.ACTIVE,
    avatar = null,
    emailVerified = false,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phone = phone;
    this.address = address;
    this.roles = Array.isArray(roles) ? roles : [];
    this.status = status;
    this.avatar = avatar;
    this.emailVerified = emailVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  hasRole(role) {
    return this.roles.includes(role);
  }

  hasAnyRole(roles) {
    return roles.some(role => this.hasRole(role));
  }

  isAdmin() {
    return this.hasRole(UserRole.ADMIN);
  }

  isStudent() {
    return this.hasRole(UserRole.STUDENT);
  }

  isTeacher() {
    return this.hasRole(UserRole.TEACHER);
  }

  isMentor() {
    return this.hasRole(UserRole.MENTOR);
  }

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }
}

// Authentication Request Models
export class LoginRequest {
  constructor(email = '', password = '') {
    this.email = email;
    this.password = password;
  }
}

export class RegisterRequest {
  constructor({
    username = '',
    email = '',
    password = '',
    fullName = '',
    phone = '',
    role = UserRole.STUDENT
  } = {}) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phone = phone;
    this.role = role;
  }
}

// Authentication Response Models
export class JwtResponse {
  constructor({
    token = '',
    type = 'Bearer',
    id = null,
    username = '',
    email = '',
    roles = []
  } = {}) {
    this.token = token;
    this.type = type;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

export class MessageResponse {
  constructor(message = '') {
    this.message = message;
  }
}

// Password related models
export class ChangePasswordRequest {
  constructor({
    currentPassword = '',
    newPassword = '',
    confirmPassword = ''
  } = {}) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}

export class ForgotPasswordRequest {
  constructor(email = '') {
    this.email = email;
  }
}

export class ResetPasswordRequest {
  constructor({
    token = '',
    password = '',
    confirmPassword = ''
  } = {}) {
    this.token = token;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
} 