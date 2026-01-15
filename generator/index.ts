import * as fs from 'fs';
import * as path from 'path';

interface PrimitiveType {
  kind?: never;
}

interface EnumType {
  kind: 'enum';
  name: string;
  values: (string | number)[];
}

interface AliasType {
  kind: 'alias';
  name: string;
  baseType: string;
}

interface ArrayType {
  kind: 'array';
  itemType: TypeReference;
}

interface ObjectField {
  name: string;
  type: TypeReference;
  optional?: boolean;
}

interface ObjectType {
  kind: 'object';
  name: string;
  fields: ObjectField[];
}

type TypeReference = 
  | string 
  | { type: 'reference'; name: string }
  | ArrayType;

type DataType = EnumType | AliasType | ObjectType;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HttpInterface {
  name: string;
  method: HttpMethod;
  path: string;
  urlParams?: ObjectField[];
  bodyType?: TypeReference;
  responseType?: TypeReference;
  headers?: string[];
  isSSE?: boolean;
}

interface Metadata {
  dataTypes: DataType[];
  httpInterfaces: HttpInterface[];
}

function typeReferenceToString(ref: TypeReference): string {
  if (typeof ref === 'string') {
    return ref;
  }
  if ('kind' in ref && ref.kind === 'array') {
    return `${typeReferenceToString(ref.itemType)}[]`;
  }
  if ('type' in ref && ref.type === 'reference') {
    return ref.name;
  }
  return 'any';
}

function generateTypeDeclarations(metadata: Metadata): string {
  let output = '// Auto-generated type declarations\n\n';

  for (const dataType of metadata.dataTypes) {
    if (dataType.kind === 'enum') {
      const enumValues = dataType.values
        .map(v => typeof v === 'string' ? `"${v}"` : v)
        .join(' | ');
      output += `export type ${dataType.name} = ${enumValues};\n\n`;
    } else if (dataType.kind === 'alias') {
      output += `export type ${dataType.name} = ${dataType.baseType};\n\n`;
    } else if (dataType.kind === 'object') {
      output += `export interface ${dataType.name} {\n`;
      for (const field of dataType.fields) {
        const optional = field.optional ? '?' : '';
        const fieldType = typeReferenceToString(field.type);
        output += `  ${field.name}${optional}: ${fieldType};\n`;
      }
      output += `}\n\n`;
    }
  }

  return output;
}

function generateServerStubs(metadata: Metadata): string {
  let output = '// Auto-generated server API stubs\n';
  output += 'import express, { Request, Response } from \'express\';\n';
  output += 'import { ' + metadata.dataTypes.map(dt => dt.name).join(', ') + ' } from \'./types\';\n\n';
  
  output += 'export function setupRoutes(app: express.Application) {\n';
  
  for (const api of metadata.httpInterfaces) {
    const method = api.method.toLowerCase();
    const path = api.path.replace(/:(\w+)/g, ':$1');
    
    output += `  app.${method}('${path}', async (req: Request, res: Response) => {\n`;
    
    if (api.isSSE) {
      output += `    res.setHeader('Content-Type', 'text/event-stream');\n`;
      output += `    res.setHeader('Cache-Control', 'no-cache');\n`;
      output += `    res.setHeader('Connection', 'keep-alive');\n`;
      output += `    // TODO: Implement SSE logic\n`;
      output += `    res.write('data: {}\\n\\n');\n`;
    } else {
      output += `    // TODO: Implement ${api.name}\n`;
      if (api.urlParams && api.urlParams.length > 0) {
        output += `    // URL params: ${api.urlParams.map(p => p.name).join(', ')}\n`;
      }
      if (api.bodyType) {
        output += `    // Body type: ${typeReferenceToString(api.bodyType)}\n`;
      }
      if (api.responseType) {
        output += `    // Response type: ${typeReferenceToString(api.responseType)}\n`;
      }
      output += `    res.json({});\n`;
    }
    
    output += `  });\n\n`;
  }
  
  output += '}\n';
  
  return output;
}

function generateClientAPI(metadata: Metadata): string {
  let output = '// Auto-generated client API\n';
  output += 'import { ' + metadata.dataTypes.map(dt => dt.name).join(', ') + ' } from \'./types\';\n\n';
  
  for (const api of metadata.httpInterfaces) {
    const params: string[] = [];
    
    if (api.urlParams && api.urlParams.length > 0) {
      params.push(...api.urlParams.map(p => `${p.name}: ${typeReferenceToString(p.type)}`));
    }
    
    if (api.bodyType) {
      params.push(`body: ${typeReferenceToString(api.bodyType)}`);
    }
    
    const returnType = api.responseType 
      ? `Promise<${typeReferenceToString(api.responseType)}>`
      : 'Promise<void>';
    
    output += `export async function ${api.name}(${params.join(', ')}): ${returnType} {\n`;
    
    let url = api.path;
    if (api.urlParams && api.urlParams.length > 0) {
      for (const param of api.urlParams) {
        url = url.replace(`:${param.name}`, `\${${param.name}}`);
      }
      url = `\`${url}\``;
    } else {
      url = `'${url}'`;
    }
    
    output += `  const response = await fetch(${url}`;
    
    if (api.method !== 'GET' || api.bodyType) {
      output += `, {\n`;
      output += `    method: '${api.method}',\n`;
      
      if (api.bodyType) {
        output += `    headers: { 'Content-Type': 'application/json' },\n`;
        output += `    body: JSON.stringify(body),\n`;
      }
      
      output += `  }`;
    }
    
    output += `);\n`;
    
    if (api.isSSE) {
      output += `  // SSE handling - return response for streaming\n`;
      output += `  return response as any;\n`;
    } else if (api.responseType) {
      output += `  return response.json();\n`;
    } else {
      output += `  return;\n`;
    }
    
    output += `}\n\n`;
  }
  
  return output;
}

function main() {
  // Use process.cwd() to get the project root directory
  const projectRoot = process.cwd();
  const metadataPath = path.join(projectRoot, 'data/metadata.json');
  const outputDir = path.join(projectRoot, 'generated');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const metadata: Metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  
  // Generate type declarations
  const types = generateTypeDeclarations(metadata);
  fs.writeFileSync(path.join(outputDir, 'types.ts'), types);
  
  // Generate server stubs
  const server = generateServerStubs(metadata);
  fs.writeFileSync(path.join(outputDir, 'server.ts'), server);
  
  // Generate client API
  const client = generateClientAPI(metadata);
  fs.writeFileSync(path.join(outputDir, 'client.ts'), client);
  
  console.log('Code generation completed successfully!');
  console.log(`Generated files in: ${outputDir}`);
}

if (require.main === module) {
  main();
}
