# scripts/knowledge

Utilidades de **desarrollo** (no un servidor) para ayudar a transformar
fuentes externas de conocimiento BBQ en `KnowledgeItem` estructurados que
luego se añaden manualmente al seed de la aplicación
(`src/db/knowledgeSeed.ts`) o se importan vía la función de importación de
datos de GrillBook.

Estos scripts se ejecutan puntualmente durante el desarrollo con
`tsx` o `ts-node`, nunca en producción y nunca como parte del bundle de la
PWA.

## Política de fuentes y copyright

- No copiar fragmentos largos ni recetas completas de libros o fuentes con
  copyright directamente en `KnowledgeItem.content`.
- Cada `KnowledgeItem` debe ser un fragmento breve, redactado o resumido,
  con `source` indicando su origen (`book`, `official`, `grillbook`, `user`).
- No incluir aquí, ni subir al repositorio, ningún PDF u otro documento
  fuente con copyright.

## Ejemplo de uso

Un script de este directorio podría leer un fichero de texto plano con
notas ya extraídas manualmente de una fuente, dividirlas en fragmentos
razonables y generar un array de `KnowledgeItem` listo para pegar en
`src/db/knowledgeSeed.ts` o exportar como JSON para importar desde
Ajustes → Datos → Importar.
