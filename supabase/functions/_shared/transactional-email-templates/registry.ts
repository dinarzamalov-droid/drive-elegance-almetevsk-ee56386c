/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as adminBookingNotification } from './admin-booking-notification.tsx'
import { template as adminCorporateRequest } from './admin-corporate-request.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'admin-booking-notification': adminBookingNotification,
  'admin-corporate-request': adminCorporateRequest,
}
