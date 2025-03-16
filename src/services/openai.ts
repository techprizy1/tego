import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
  console.error('Please set your OpenAI API key in the .env file');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateInvoiceData(prompt: string): Promise<any> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
    throw new Error('Please set your OpenAI API key in the .env file. You can find your API key at https://platform.openai.com/account/api-keys');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an invoice generation assistant. Convert the user's prompt into a structured invoice JSON object with the following fields: invoiceNumber, date, dueDate, company (name, address, email), client (name, address, email, state), items (array of: description, quantity, price, amount, taxRate, taxType). Each item should include its own tax rate (as percentage) and taxType ('gst' for same state or 'igst' for different state transactions). Use INR as the currency. ALWAYS return valid JSON.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response received from OpenAI');
    }

    try {
      const data = JSON.parse(content);
      
      // Determine if IGST applies (different states) or CGST+SGST (same state)
      const sameState = data.company.state === data.client.state;

      // Calculate tax for each item
      data.items = data.items.map(item => {
        const taxRate = item.taxRate || 18; // Default to 18% if not specified
        const amount = item.quantity * item.price;

        if (sameState) {
          // Split tax into CGST and SGST
          const halfTaxRate = taxRate / 2;
          const halfTaxAmount = (amount * halfTaxRate) / 100;
          
          return {
            ...item,
            amount,
            taxRate,
            taxType: 'gst',
            cgst: halfTaxAmount,
            sgst: halfTaxAmount,
            igst: 0,
            totalTaxAmount: halfTaxAmount * 2
          };
        } else {
          // Apply full tax as IGST
          const taxAmount = (amount * taxRate) / 100;
          
          return {
            ...item,
            amount,
            taxRate,
            taxType: 'igst',
            cgst: 0,
            sgst: 0,
            igst: taxAmount,
            totalTaxAmount: taxAmount
          };
        }
      });

      // Calculate totals
      data.subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
      data.cgstTotal = data.items.reduce((sum, item) => sum + (item.cgst || 0), 0);
      data.sgstTotal = data.items.reduce((sum, item) => sum + (item.sgst || 0), 0);
      data.igstTotal = data.items.reduce((sum, item) => sum + (item.igst || 0), 0);
      data.totalTax = data.cgstTotal + data.sgstTotal + data.igstTotal;
      data.total = data.subtotal + data.totalTax;

      return data;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse the generated invoice data. Please try again.');
    }
  } catch (error: any) {
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your API key at https://platform.openai.com/account/api-keys');
    }
    if (error.code === 'model_not_found') {
      throw new Error('The selected OpenAI model is not available. Please try again later.');
    }
    console.error('Error generating invoice data:', error);
    throw new Error(error.message || 'Failed to generate invoice. Please try again.');
  }
}