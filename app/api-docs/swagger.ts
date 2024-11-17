export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Virtual Physics Lab API',
      version: '1.0.0',
      description: `
        API documentation for Virtual Physics Lab application.
        This API provides endpoints for managing user data, experiments, and analytics.
        
        Features:
        - User Authentication (OAuth with Google and GitHub)
        - User Profile Management
        - Experiment Data Management
        - Analytics and Reports
      `,
      contact: {
        name: 'Dzulfaqor Ali',
        email: 'dzulfaqor2003@gmail.com',
        url: 'https://portofolio-webdz.vercel.app/'
      },
      license: {
        name: 'ITB',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://virtual-physics-lab.vercel.app/api-docs',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000/api-docs',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            image: { type: 'string' },
            profile: {
              type: 'object',
              properties: {
                bio: { type: 'string' },
                institution: { type: 'string' },
                role: { type: 'string' },
                expertise: {
                  type: 'array',
                  items: { type: 'string' }
                },
                social: {
                  type: 'object',
                  properties: {
                    twitter: { type: 'string' },
                    linkedin: { type: 'string' },
                    github: { type: 'string' }
                  }
                },
                stats: {
                  type: 'object',
                  properties: {
                    experimentsCompleted: { type: 'number' },
                    totalExperimentTime: { type: 'number' },
                    totalTimeSpent: { type: 'number' },
                    avgDuration: { type: 'number' },
                    avgAngle: { type: 'number' },
                    lastActive: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        },
        Experiment: {
          type: 'object',
          required: ['userId', 'title', 'parameters', 'duration'],
          properties: {
            userId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            parameters: {
              type: 'object',
              properties: {
                length: { type: 'number' },
                mass: { type: 'number' },
                angle: { type: 'number' }
              }
            },
            duration: { type: 'number' },
            measurements: {
              type: 'array',
              items: { type: 'object' }
            }
          }
        },
        ExperimentStats: {
          type: 'object',
          properties: {
            totalExperiments: { type: 'number' },
            avgDuration: { type: 'string' },
            avgAngle: { type: 'string' },
            totalTime: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/user/profile': {
        get: {
          tags: ['User'],
          summary: 'Get user profile',
          responses: {
            '200': {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['User'],
          summary: 'Update user profile',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        }
      },
      '/experiments': {
        post: {
          tags: ['Experiments'],
          summary: 'Save experiment data',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Experiment'
                }
              }
            }
          }
        },
        get: {
          tags: ['Experiments'],
          summary: 'Get user experiments',
          parameters: [
            {
              in: 'query',
              name: 'timeRange',
              schema: {
                type: 'string',
                enum: ['all', 'today', 'week', 'month']
              }
            }
          ]
        }
      }
    }
  };