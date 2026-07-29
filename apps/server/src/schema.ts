import {
  bigint,
  datetime,
  mysqlTable,
  tinyint,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('Users', {
  email: varchar('email', { length: 100 }).primaryKey(),
  nickname: varchar('nickname', { length: 20 }).notNull(),
  avatar: varchar('avatar', { length: 200 }),
  intro: varchar('intro', { length: 100 }),
  admin: tinyint('admin'),
  approved: tinyint('approved').notNull().default(0),
  createdAt: datetime('createdAt').notNull(),
  deletedAt: datetime('deletedAt'),
});

export const places = mysqlTable('Places', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  desc: varchar('desc', { length: 200 }).notNull(),
  images: varchar('images', { length: 1000 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  createdAt: datetime('createdAt').notNull(),
  modifiedAt: datetime('modifiedAt').notNull(),
});

export const tags = mysqlTable('Tags', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
});

export const tagRelations = mysqlTable('TagRelations', {
  tagId: bigint('tagId', { mode: 'number', unsigned: true }).notNull(),
  placeId: bigint('placeId', { mode: 'number', unsigned: true }).notNull(),
});

export const sessions = mysqlTable('Sessions', {
  session: varchar('session', { length: 100 }).primaryKey(),
  email: varchar('email', { length: 100 }).notNull(),
  last: datetime('last').notNull(),
});

export const likes = mysqlTable(
  'Likes',
  {
    place: bigint('place', { mode: 'number', unsigned: true }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
  },
  (t) => [uniqueIndex('Likes_UN').on(t.place, t.email)],
);

export const comments = mysqlTable('Comments', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  comment: varchar('comment', { length: 100 }).notNull(),
  place: bigint('place', { mode: 'number', unsigned: true }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  createdAt: datetime('createdAt').notNull(),
  modifiedAt: datetime('modifiedAt'),
});

export const bp = mysqlTable('BP', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  systolic: bigint('systolic', { mode: 'number' }).notNull(),
  diastolic: bigint('diastolic', { mode: 'number' }).notNull(),
  createdAt: datetime('createdAt').notNull(),
});
