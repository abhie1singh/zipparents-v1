/**
 * Age verification utilities
 * COPPA compliance - must be 18+ to use the platform
 */

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function isAgeVerified(dateOfBirth: string): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= 18;
}

export function getAgeVerificationError(dateOfBirth: string): string | null {
  if (!dateOfBirth) {
    return 'Date of birth is required';
  }

  const age = calculateAge(dateOfBirth);

  if (age < 18) {
    return 'You must be 18 or older to use ZipParents';
  }

  if (age > 120) {
    return 'Please enter a valid date of birth';
  }

  return null;
}

export function formatDateOfBirth(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
