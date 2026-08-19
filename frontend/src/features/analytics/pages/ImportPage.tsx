import CloudUpload from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRef, useState, type ChangeEvent } from 'react';
import { AppShell } from '../../../shared/components/layout';
import { PageHeader } from '../../../shared/components/ui';
import { useUploadCsv } from '../hooks/useUploadCsv';

export function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const uploadMutation = useUploadCsv();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setFileName(file.name);
    uploadMutation.mutate(file);
  };

  function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      if (data?.message) return data.message;
    }
    if (error instanceof Error) return error.message;
    return 'Falha na importação.';
  }

  return (
    <AppShell title="Importar dados">
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <PageHeader
          title="Importar dados"
          subtitle="Utilize o relatório CSV exportado do MktZap para atualizar a base de dados."
        />

        <Card
          variant="outlined"
          sx={{ borderStyle: 'dashed', borderWidth: 2, textAlign: 'center', p: 6 }}
        >
          <CloudUpload sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">Arraste o arquivo CSV aqui</Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>
            ou
          </Typography>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            onClick={() => inputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            Selecionar arquivo
          </Button>
          <Typography variant="caption" component="p" color="text.secondary" sx={{ mt: 3 }}>
            {fileName || 'Formatos aceitos: .csv'}
          </Typography>

          {uploadMutation.isPending && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Importando...
            </Typography>
          )}
          {uploadMutation.isSuccess && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Importado com sucesso! {uploadMutation.data.rowCount} registros (
              {uploadMutation.data.skipped} ignorados)
            </Typography>
          )}
          {uploadMutation.isError && (
            <Typography color="error.main" sx={{ mt: 2 }}>
              {getErrorMessage(uploadMutation.error)}
            </Typography>
          )}
        </Card>
      </Box>
    </AppShell>
  );
}
