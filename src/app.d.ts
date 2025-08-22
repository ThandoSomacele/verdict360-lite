// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      tenantId: string;
      cors?: {
        origin: string;
        credentials: boolean;
      };
      user?: {
        id: string;
        email: string;
        role: string;
        tenantId?: string;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};