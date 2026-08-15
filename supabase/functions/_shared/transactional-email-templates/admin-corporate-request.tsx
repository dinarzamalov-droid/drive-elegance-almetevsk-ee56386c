/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = '3D Drive'
const ADMIN_EMAIL = '3d.drive@mail.ru'

interface AdminCorporateRequestProps {
  company?: string
  inn?: string
  contactName?: string
  phone?: string
  clientEmail?: string
  needDocs?: boolean
  deferredPayment?: boolean
  message?: string
  createdAt?: string
}

const AdminCorporateRequestEmail = ({
  company, inn, contactName, phone, clientEmail, needDocs, deferredPayment, message, createdAt,
}: AdminCorporateRequestProps) => (
  <Html lang="ru" dir="ltr">
    <Head />
    <Preview>КОРПОРАТИВНАЯ заявка — {company ?? 'компания'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={badge}>ВЫСОКИЙ ПРИОРИТЕТ · КОРПОРАТИВНАЯ ЗАЯВКА</Text>
        <Heading style={h1}>Запрос коммерческого предложения</Heading>
        <Text style={text}>Поступила корпоративная заявка с сайта {SITE_NAME}.</Text>

        <Section style={card}>
          <Heading style={h2}>Компания</Heading>
          <Text style={row}><b>Название:</b> {company ?? '—'}</Text>
          <Text style={row}><b>ИНН:</b> {inn || '—'}</Text>
        </Section>

        <Section style={card}>
          <Heading style={h2}>Контакт</Heading>
          <Text style={row}><b>Контактное лицо:</b> {contactName ?? '—'}</Text>
          <Text style={row}><b>Телефон:</b> {phone ?? '—'}</Text>
          <Text style={row}><b>Email:</b> {clientEmail || '—'}</Text>
        </Section>

        <Section style={card}>
          <Heading style={h2}>Условия</Heading>
          <Text style={row}><b>Закрывающие документы:</b> {needDocs ? 'да' : 'нет'}</Text>
          <Text style={row}><b>Отсрочка платежа:</b> {deferredPayment ? 'да' : 'нет'}</Text>
          {message ? <Text style={row}><b>Комментарий:</b> {message}</Text> : null}
        </Section>

        {createdAt ? <Text style={row}><b>Дата заявки:</b> {createdAt}</Text> : null}

        <Hr style={hr} />
        <Text style={footer}>Письмо отправлено автоматически на {ADMIN_EMAIL}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminCorporateRequestEmail,
  subject: (d: Record<string, any>) =>
    `🔴 КОРПОРАТИВНАЯ заявка — ${d?.company ?? 'компания'} (${d?.contactName ?? ''})`,
  displayName: 'Уведомление администратору о корпоративной заявке',
  to: ADMIN_EMAIL,
  previewData: {
    company: 'ООО «Татнефть-Сервис»',
    inn: '1644000000',
    contactName: 'Иванов Иван',
    phone: '+7 999 123 45 67',
    clientEmail: 'corp@example.com',
    needDocs: true,
    deferredPayment: true,
    message: 'Нужны 3 автомобиля на 6 месяцев.',
    createdAt: '15.08.2026 21:30',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const badge = { fontSize: '12px', fontWeight: 'bold' as const, color: '#ffffff', backgroundColor: '#b8893e', padding: '6px 10px', borderRadius: '4px', display: 'inline-block', margin: '0 0 12px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 16px' }
const h2 = { fontSize: '15px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.5', margin: '0 0 16px' }
const card = { padding: '14px 16px', backgroundColor: '#f8f8f8', borderRadius: '8px', margin: '0 0 12px' }
const row = { fontSize: '13px', color: '#222', margin: '4px 0', lineHeight: '1.5' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '0' }
