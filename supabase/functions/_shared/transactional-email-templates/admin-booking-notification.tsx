/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Link, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = '3D Drive'
const ADMIN_EMAIL = '3d.drive@mail.ru'

interface AdminBookingNotificationProps {
  fullName?: string
  phone?: string
  clientEmail?: string
  carLabel?: string
  dateFrom?: string
  dateTo?: string
  days?: number
  city?: string
  totalCost?: string
  prepay?: string
  deposit?: string
  paymentMethod?: string
  contractPdfUrl?: string
  contractDocxUrl?: string
}

const AdminBookingNotificationEmail = ({
  fullName, phone, clientEmail, carLabel, dateFrom, dateTo, days, city,
  totalCost, prepay, deposit, paymentMethod, contractPdfUrl, contractDocxUrl,
}: AdminBookingNotificationProps) => (
  <Html lang="ru" dir="ltr">
    <Head />
    <Preview>Новое бронирование — {carLabel ?? 'автомобиль'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Новое бронирование</Heading>
        <Text style={text}>Поступило новое бронирование на сайте {SITE_NAME}.</Text>

        <Section style={card}>
          <Heading style={h2}>Клиент</Heading>
          <Text style={row}><b>ФИО:</b> {fullName ?? '—'}</Text>
          <Text style={row}><b>Телефон:</b> {phone ?? '—'}</Text>
          <Text style={row}><b>Email:</b> {clientEmail ?? '—'}</Text>
        </Section>

        <Section style={card}>
          <Heading style={h2}>Аренда</Heading>
          <Text style={row}><b>Автомобиль:</b> {carLabel ?? '—'}</Text>
          <Text style={row}><b>Даты:</b> {dateFrom} — {dateTo} ({days} сут.)</Text>
          <Text style={row}><b>Город:</b> {city ?? '—'}</Text>
          <Text style={row}><b>Способ оплаты:</b> {paymentMethod ?? '—'}</Text>
        </Section>

        <Section style={card}>
          <Heading style={h2}>Стоимость</Heading>
          <Text style={row}><b>Итого:</b> {totalCost} ₽</Text>
          <Text style={row}><b>Предоплата:</b> {prepay} ₽</Text>
          <Text style={row}><b>Залог:</b> {deposit} ₽</Text>
        </Section>

        {(contractPdfUrl || contractDocxUrl) && (
          <Section style={card}>
            <Heading style={h2}>Договор</Heading>
            {contractPdfUrl && (
              <Text style={row}>
                <Link href={contractPdfUrl} style={link}>Скачать договор (PDF)</Link>
              </Text>
            )}
            {contractDocxUrl && (
              <Text style={row}>
                <Link href={contractDocxUrl} style={link}>Скачать договор (Word)</Link>
              </Text>
            )}
          </Section>
        )}

        <Hr style={hr} />
        <Text style={footer}>Письмо отправлено автоматически на {ADMIN_EMAIL}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminBookingNotificationEmail,
  subject: (d: Record<string, any>) => `Новое бронирование — ${d?.carLabel ?? '3D Drive'} (${d?.fullName ?? ''})`,
  displayName: 'Уведомление администратору о бронировании',
  to: ADMIN_EMAIL,
  previewData: {
    fullName: 'Иванов Иван Иванович',
    phone: '+7 999 123 45 67',
    clientEmail: 'client@example.com',
    carLabel: 'BMW 420i',
    dateFrom: '01.06.2026',
    dateTo: '03.06.2026',
    days: 2,
    city: 'Альметьевск',
    totalCost: '24 000',
    prepay: '7 200',
    deposit: '30 000',
    paymentMethod: 'Наличные',
    contractPdfUrl: 'https://example.com/contract.pdf',
    contractDocxUrl: 'https://example.com/contract.docx',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 16px' }
const h2 = { fontSize: '15px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.5', margin: '0 0 16px' }
const card = { padding: '14px 16px', backgroundColor: '#f8f8f8', borderRadius: '8px', margin: '0 0 12px' }
const row = { fontSize: '13px', color: '#222', margin: '4px 0', lineHeight: '1.5' }
const link = { color: '#b8893e', textDecoration: 'underline' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '0' }
