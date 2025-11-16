export async function processCSVWithAI(csvText: string) {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY
  
  if (!HF_TOKEN) {
    throw new Error('Hugging Face API key not configured')
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: { 
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: `Clean and extract product data from this CSV. Extract: title, description, price, brand, category, images. Format as JSON: ${csvText.substring(0, 1000)}` 
        }),
      }
    )
    
    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('AI processing failed:', error)
    return null
  }
}

export async function enhanceProductData(productData: any) {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY
  
  if (!HF_TOKEN || !productData.description) {
    return productData
  }

  try {
    // Extract dimensions from description
    const dimensionRegex = /(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)/i
    const weightRegex = /(\d+\.?\d*)\s*(grams?|kg|g)/i
    
    const description = productData.description
    
    // Extract dimensions
    const dimMatch = description.match(dimensionRegex)
    if (dimMatch) {
      productData.length = parseFloat(dimMatch[1])
      productData.width = parseFloat(dimMatch[2]) 
      productData.height = parseFloat(dimMatch[3])
    }
    
    // Extract weight
    const weightMatch = description.match(weightRegex)
    if (weightMatch) {
      let weight = parseFloat(weightMatch[1])
      if (weightMatch[2].toLowerCase().includes('kg')) {
        weight = weight * 1000 // Convert kg to grams
      }
      productData.weight = weight
    }
    
    return productData
  } catch (error) {
    console.error('Enhancement failed:', error)
    return productData
  }
}