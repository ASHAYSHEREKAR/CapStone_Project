import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as Array<'USER' | 'ADMIN' | 'ENGINEER'>;
  const userRole = authService.getRole() as 'USER' | 'ADMIN' | 'ENGINEER';

  if (expectedRoles && userRole && !expectedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') {
      router.navigate(['/admin']);
    } else if (userRole === 'ENGINEER') {
      router.navigate(['/engineer']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
