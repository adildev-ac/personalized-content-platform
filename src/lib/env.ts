// src/lib/env.ts
// Environment variable validation and sanitization

/**
 * Validates and provides safe access to environment variables
 */
class EnvValidator {
  private static instance: EnvValidator;
  private validationErrors: string[] = [];
  
  /**
   * Get singleton instance
   */
  public static getInstance(): EnvValidator {
    if (!EnvValidator.instance) {
      EnvValidator.instance = new EnvValidator();
    }
    return EnvValidator.instance;
  }
  
  /**
   * Validates the presence and format of environment variables
   * @returns An array of validation error messages
   */
  public validateEnv(): string[] {
    this.validationErrors = [];
    
    // API URL is required
    this.validateRequired('NEXT_PUBLIC_STRAPI_URL', 'API URL');
    
    // Giscus validation only if any Giscus env vars are present
    if (process.env.NEXT_PUBLIC_GISCUS_REPO) {
      // Required Giscus variables
      this.validateRequired('NEXT_PUBLIC_GISCUS_REPO', 'Giscus repository');
      this.validateRequired('NEXT_PUBLIC_GISCUS_REPO_ID', 'Giscus repository ID');
      this.validateRequired('NEXT_PUBLIC_GISCUS_CATEGORY', 'Giscus category');
      this.validateRequired('NEXT_PUBLIC_GISCUS_CATEGORY_ID', 'Giscus category ID');
      
      // Format validation
      this.validateFormat(
        'NEXT_PUBLIC_GISCUS_REPO', 
        /^[\w.-]+\/[\w.-]+$/, 
        'must be in format "owner/repo"'
      );
      
      this.validateFormat(
        'NEXT_PUBLIC_GISCUS_REPO_ID',
        /^R_[a-zA-Z0-9_]+$/,
        'must be a valid GitHub repository ID (starts with R_)'
      );
      
      this.validateFormat(
        'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
        /^DIC_[a-zA-Z0-9_]+$/,
        'must be a valid GitHub discussion category ID (starts with DIC_)'
      );
    }
    
    // NextAuth validation only if any auth env vars are present
    if (process.env.NEXTAUTH_URL || process.env.NEXTAUTH_SECRET) {
      this.validateRequired('NEXTAUTH_URL', 'NextAuth URL');
      this.validateRequired('NEXTAUTH_SECRET', 'NextAuth secret');
      
      // Secret strength validation
      const secret = process.env.NEXTAUTH_SECRET || '';
      if (secret && secret.length < 32) {
        this.validationErrors.push('NEXTAUTH_SECRET is too weak (should be at least 32 characters)');
      }
    }
    
    return this.validationErrors;
  }
  
  /**
   * Safely get an environment variable with validation and fallback
   * @param key - Environment variable name
   * @param fallback - Default value if not found
   * @param required - Whether the variable is required
   * @returns The environment variable value or fallback
   */
  public get(key: string, fallback: string = '', required: boolean = false): string {
    const value = process.env[key] || fallback;
    
    if (required && !value) {
      console.error(`Missing required environment variable: ${key}`);
    }
    
    return value;
  }
  
  /**
   * Check if all required environment variables are set
   * @returns True if all required variables are present
   */
  public isValid(): boolean {
    return this.validateEnv().length === 0;
  }
  
  /**
   * Get all validation errors
   * @returns Array of validation error messages
   */
  public getErrors(): string[] {
    return this.validationErrors;
  }
  
  // Private methods
  
  /**
   * Validate that a required environment variable is present
   */
  private validateRequired(key: string, label: string): void {
    if (!process.env[key]) {
      this.validationErrors.push(`${label} (${key}) is required but not set`);
    }
  }
  
  /**
   * Validate that an environment variable matches a specific format
   */
  private validateFormat(key: string, pattern: RegExp, message: string): void {
    const value = process.env[key];
    if (value && !pattern.test(value)) {
      this.validationErrors.push(`${key} ${message}, but got "${value}"`);
    }
  }
}

// Create and export singleton instance
export const env = EnvValidator.getInstance();

// Export a function to check environment during build/startup
export function validateEnvironment(): void {
  const errors = env.validateEnv();
  
  if (errors.length > 0) {
    console.warn("⚠️ Environment validation warnings:");
    errors.forEach(err => console.warn(`  - ${err}`));
  }
}
