import { relations } from 'drizzle-orm';

import {
  drug,
  implant,
  implant_attribute,
  implant_value,
  item,
  item_effect,
  item_prerequisite,
  item_prerequisite_implant,
  item_prerequisite_race,
  item_prerequisite_title,
  kit,
  kit_effect,
  kit_prerequisite,
  kit_prerequisite_implant,
  kit_prerequisite_race,
  kit_prerequisite_title,
  stat_modifier,
} from './schema.js';

// Relations of the catalog queries, named after the tables: the nested keys
// of the API responses (the PostgREST embedding names).

export const itemRelations = relations(item, ({ many }) => ({
  item_prerequisite: many(item_prerequisite),
  item_prerequisite_title: many(item_prerequisite_title),
  item_prerequisite_implant: many(item_prerequisite_implant),
  item_prerequisite_race: many(item_prerequisite_race),
  item_effect: many(item_effect),
}));

export const itemPrerequisiteRelations = relations(
  item_prerequisite,
  ({ one }) => ({
    item: one(item, {
      fields: [item_prerequisite.item_id],
      references: [item.id],
    }),
  }),
);

export const itemPrerequisiteTitleRelations = relations(
  item_prerequisite_title,
  ({ one }) => ({
    item: one(item, {
      fields: [item_prerequisite_title.item_id],
      references: [item.id],
    }),
  }),
);

export const itemPrerequisiteImplantRelations = relations(
  item_prerequisite_implant,
  ({ one }) => ({
    item: one(item, {
      fields: [item_prerequisite_implant.item_id],
      references: [item.id],
    }),
    implant: one(implant, {
      fields: [item_prerequisite_implant.implant_id],
      references: [implant.id],
    }),
  }),
);

export const itemPrerequisiteRaceRelations = relations(
  item_prerequisite_race,
  ({ one }) => ({
    item: one(item, {
      fields: [item_prerequisite_race.item_id],
      references: [item.id],
    }),
  }),
);

export const itemEffectRelations = relations(item_effect, ({ one }) => ({
  item: one(item, {
    fields: [item_effect.item_id],
    references: [item.id],
  }),
}));

export const kitRelations = relations(kit, ({ many }) => ({
  kit_effect: many(kit_effect),
  kit_prerequisite: many(kit_prerequisite),
  kit_prerequisite_title: many(kit_prerequisite_title),
  kit_prerequisite_implant: many(kit_prerequisite_implant),
  kit_prerequisite_race: many(kit_prerequisite_race),
}));

export const kitEffectRelations = relations(kit_effect, ({ one }) => ({
  kit: one(kit, { fields: [kit_effect.kit_id], references: [kit.id] }),
}));

export const kitPrerequisiteRelations = relations(
  kit_prerequisite,
  ({ one }) => ({
    kit: one(kit, { fields: [kit_prerequisite.kit_id], references: [kit.id] }),
  }),
);

export const kitPrerequisiteTitleRelations = relations(
  kit_prerequisite_title,
  ({ one }) => ({
    kit: one(kit, {
      fields: [kit_prerequisite_title.kit_id],
      references: [kit.id],
    }),
  }),
);

export const kitPrerequisiteImplantRelations = relations(
  kit_prerequisite_implant,
  ({ one }) => ({
    kit: one(kit, {
      fields: [kit_prerequisite_implant.kit_id],
      references: [kit.id],
    }),
    implant: one(implant, {
      fields: [kit_prerequisite_implant.implant_id],
      references: [implant.id],
    }),
  }),
);

export const kitPrerequisiteRaceRelations = relations(
  kit_prerequisite_race,
  ({ one }) => ({
    kit: one(kit, {
      fields: [kit_prerequisite_race.kit_id],
      references: [kit.id],
    }),
  }),
);

export const implantRelations = relations(implant, ({ many }) => ({
  implant_attribute: many(implant_attribute),
  implant_value: many(implant_value),
}));

export const implantAttributeRelations = relations(
  implant_attribute,
  ({ one }) => ({
    implant: one(implant, {
      fields: [implant_attribute.implant_id],
      references: [implant.id],
    }),
  }),
);

export const implantValueRelations = relations(implant_value, ({ one }) => ({
  implant: one(implant, {
    fields: [implant_value.implant_id],
    references: [implant.id],
  }),
}));

export const drugRelations = relations(drug, ({ many }) => ({
  stat_modifier: many(stat_modifier),
}));

export const statModifierRelations = relations(stat_modifier, ({ one }) => ({
  drug: one(drug, { fields: [stat_modifier.drug_id], references: [drug.id] }),
}));
