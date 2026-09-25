export * from './prerequisite.mapper';
// prerequisite.schema is left out on purpose: it pulls zod, which the item and
// kit schemas load lazily. Import it by its path from those schemas.
