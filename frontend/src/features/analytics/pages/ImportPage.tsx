import CloudUpload from '@mui/icons-material/CloudUpload';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import { AppShell } from '../../../shared/components/layout';
import { PageHeader } from '../../../shared/components/ui';

export function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  return (
    <AppShell title="Importar dados">
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <PageHeader
          title="Importar dados"
          subtitle="Utilize o relatório CSV exportado do MktZap para atualizar a base de dados."
        />

        <Card sx={{ mb: 4, bgcolor: 'grey.100' }}>
          <CardContent sx={{ display: 'flex', gap: 2 }}>
            <InfoOutlined color="primary" />
            <Typography variant="body2">
              A análise atual ocorre no nível de atendente, conforme extraído do MktZap.
            </Typography>
          </CardContent>
        </Card>

        <Stepper activeStep={0} alternativeLabel sx={{ mb: 5 }}>
          {['Selecionar arquivo', 'Validar dados', 'Importar'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
          />
          <Button variant="outlined" onClick={() => inputRef.current?.click()}>
            Selecionar arquivo
          </Button>
          <Typography variant="caption" component="p" color="text.secondary" sx={{ mt: 3 }}>
            {fileName || 'Formatos aceitos: .csv'}
          </Typography>
        </Card>
      </Box>
    </AppShell>
  );
}
