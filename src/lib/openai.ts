import { AzureOpenAI } from 'openai';


export const getOpenAIClientSSt = (ttsApiKey: string, ttsTargetUri: string) => {

  if (!ttsApiKey || !ttsTargetUri) {
    return null;
  }

  const urlInfo = extractUrlInfo(ttsTargetUri);
  const deployment = urlInfo?.deployment;
  const endpoint = urlInfo?.endpoint;
  const apiVersion = urlInfo?.apiVersion;

  return new AzureOpenAI({
    endpoint: endpoint,
    apiVersion: apiVersion,
    apiKey: ttsApiKey,
    deployment: deployment,
    dangerouslyAllowBrowser: true
  });

};

export const getOpenAIClient = () => {
  const completionApiKey = localStorage.getItem('completionApiKey') || '';
  const completionTargetUri = localStorage.getItem('completionTargetUri') || '';

  if (!completionApiKey || !completionTargetUri) {
    throw new Error('Missing API key or target URI, Please check your settings');
  }

  const urlInfo = extractUrlInfo(completionTargetUri);
  const deployment = urlInfo?.deployment;
  const endpoint = urlInfo?.endpoint;
  const apiVersion = urlInfo?.apiVersion;

  return new AzureOpenAI({
    endpoint: endpoint,
    apiVersion: apiVersion,
    apiKey: completionApiKey,
    deployment: deployment,
    dangerouslyAllowBrowser: true
  });

};


const getAssistantFileById = async (fileId: string) => {
  const [file, fileContent] = await Promise.all([
    getOpenAIClient().files.retrieve(fileId),
    getOpenAIClient().files.content(fileId)
  ]);
  return {
    file,
    fileContent
  };
};


export function extractUrlInfo(url: string): { deployment: string; apiVersion: string; endpoint: string } | null {
  try {
    const urlObj = new URL(url);

    // Extract deployment from the path
    const pathSegments = urlObj.pathname.split('/');
    const deploymentIndex = pathSegments.indexOf('deployments');
    const deployment = deploymentIndex !== -1 ? pathSegments[deploymentIndex + 1] : null;

    // Extract api-version from query parameters
    const apiVersion = urlObj.searchParams.get('api-version');

    // Extract endpoint
    const endpoint = `${urlObj.protocol}//${urlObj.host}`;

    if (!deployment || !apiVersion) {
      throw new Error('Required values missing in the URL.');
    }

    return { deployment, apiVersion, endpoint };
  } catch (error: any) {
    console.error('Invalid URL or extraction error:', error.message);
    return null;
  }
}

export async function getCompletion(messages: any): Promise<string> {
  const completionApiKey = localStorage.getItem('completionApiKey') || '';
  const completionTargetUri = localStorage.getItem('completionTargetUri') || '';

  if (!completionApiKey || !completionTargetUri) {
    return 'Missing API key or target URI, Please check your settings';
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': completionApiKey
  };

  const raw = JSON.stringify({
    'messages': messages
  });

  try {
    const response = await fetch(completionTargetUri, {
      method: 'POST',
      headers: headers,
      body: raw
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices[0]?.message?.content || 'error';
  } catch (error) {
    console.error('Error fetching completion:', error);
    return 'Error fetching completion';
  }
}


export async function getJsonData(messages: any): Promise<string> {
  const completionApiKey = localStorage.getItem('completionApiKey') || '';
  const completionTargetUri = localStorage.getItem('completionTargetUri') || '';

  if (!completionApiKey || !completionTargetUri) {
    return 'Missing API key or target URI, Please check your settings';
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': completionApiKey
  };

  const raw = JSON.stringify({
    messages: messages
  });

  try {
    const response = await fetch(completionTargetUri, {
      method: 'POST',
      headers: headers,
      body: raw
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data?.choices[0]?.message?.content || 'error';
  } catch (error) {
    console.error('Error fetching completion:', error);
    return 'Error fetching completion';
  }
}


export async function getImages(prompt: string): Promise<string> {
  const dallApiKey = localStorage.getItem('dallApiKey') || '';
  const dallTargetUri = localStorage.getItem('dallTargetUri') || '';

  if (!dallApiKey || !dallTargetUri) {
    return 'Missing API key or target URI, Please check your settings';
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': dallApiKey
  };

  try {
    const response = await fetch(dallTargetUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        'prompt': prompt,
        'n': 1,
        'size': '1024x1024'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    data.message = '绘画完成，请你不要阅读网址，只阅读图画简介';

    return data || 'error. please try again later.';
  } catch (error) {
    console.error('Error fetching completion:', error);
    return 'Error fetching completion';
  }
}


export async function editImages(prompt: string, image_base_64: string): Promise<string> {
  const completionApiKey = localStorage.getItem('completionApiKey') || '';
  const completionTargetUri = localStorage.getItem('completionTargetUri') || '';

  if (!completionApiKey || !completionTargetUri) {
    return 'Missing API key or target URI, Please check your settings';
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': completionApiKey
  };

  // image_base_64 to io read
  const base64 = image_base_64.split(',')[1];
  const imageData = atob(base64);
  const uint8Array = new Uint8Array(imageData.length);

  for (let i = 0; i < imageData.length; i++) {
    uint8Array[i] = imageData.charCodeAt(i);
  }

  const imageBlob = new Blob([uint8Array], { type: 'image/png' });

  try {
    const response = await fetch(completionTargetUri, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        'prompt': prompt,
        'n': 1,
        'size': '1024x1024',
        'image': imageBlob
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data || 'error';
  } catch (error) {
    console.error('Error fetching completion:', error);
    return 'Error fetching completion';
  }
}