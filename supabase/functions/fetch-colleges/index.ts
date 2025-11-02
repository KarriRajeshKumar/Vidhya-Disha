import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Read the government colleges data from the JSON file
    const collegesData = await Deno.readTextFile('./jk_govt_colleges_148.json')
    const colleges = JSON.parse(collegesData)

    // Transform the data to match the expected format
    const institutions = colleges.map((college: any) => ({
      name: college.name,
      address: college.address,
      type: college.type,
      latitude: college.latitude.toString(),
      longitude: college.longitude.toString()
    }))

    return new Response(
      JSON.stringify({ institutions }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error fetching colleges:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function extractLocation(snippet: string, coordinates: [number, number]): string {
  const cities = ['Jammu', 'Srinagar', 'Rajouri', 'Samba', 'Anantnag', 'Baramulla']
  for (const city of cities) {
    if (snippet.toLowerCase().includes(city.toLowerCase())) {
      return `${city}, ${city}`
    }
  }
  return getCity(coordinates)
}

function getCity(coordinates: [number, number]): string {
  const [lat, lng] = coordinates
  if (lat > 34) return 'Srinagar'
  if (lat > 33.5) return 'Baramulla'  
  if (lat > 33) return 'Rajouri'
  if (lng > 75) return 'Samba'
  return 'Jammu'
}