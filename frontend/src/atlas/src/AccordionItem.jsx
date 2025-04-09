// AccordionItem.js
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionItem = ({ title, content }) => {
  return (
    <Accordion 
      sx={{ 
        backgroundColor: '#c18400', 
        borderRadius: '10px !important', 
        overflow: 'hidden',
        marginBottom: '1rem',
        
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          backgroundColor: '#c18400', 
          '&:hover': {
            backgroundColor: '#ffae00',
          },
          borderRadius: '0 !important',
          height: '56px',
          minHeight: '56px',
          alignItems: 'center',

        }}
      >
        <Typography component="span" sx={{ fontSize: '1rem',fontWeight: 'bold', color:'white' }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0, borderRadius: '0 !important' }}>
        {content}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionItem;
