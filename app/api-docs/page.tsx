'use client';

import '@/app/globals.css'
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { swaggerSpec } from './swagger';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div className="container mx-auto p-4">
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}