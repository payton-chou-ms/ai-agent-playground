import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';

import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { MS_GRAPH_TOKEN } from '../pages/ConsolePage';

export const definition: ToolDefinitionType = {
  name: 'microsoft_graph',
  description: 'Get user details from Microsoft Graph API',
  parameters: {
    type: 'object',
    properties: {}
  }
};


export const handler: Function = async () => {

  return {
    message: '接入微软内部系统的程序还在开发中'
  };

  const client = Client.init({
    authProvider: (done) => {
      done(null, MS_GRAPH_TOKEN);
    }
  });

  try {
    let userDetails = await client.api('/me').get();
    console.log(userDetails);
    return userDetails;
  } catch (error) {
    throw error;
  }

};
