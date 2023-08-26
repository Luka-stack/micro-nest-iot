// export const producentsToTypesRelations = relations(
//   producentsToTypes,
//   ({ one }) => ({
//     producent: one(producents, {
//       fields: [producentsToTypes.producentId],
//       references: [producents.id],
//     }),
//     type: one(types, {
//       fields: [producentsToTypes.typeId],
//       references: [types.id],
//     }),
//   }),
// );
