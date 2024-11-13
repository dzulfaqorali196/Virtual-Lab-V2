export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Virtual Physics Lab API',
      version: '1.0.0',
      description: `
        API documentation for Virtual Physics Lab application.
        This API provides endpoints for managing user data, experiments, learning progress, and analytics.
        
        Features:
        - User Authentication (OAuth with Google and GitHub)
        - User Profile Management
        - Experiment Data Management
        - Learning Progress Tracking
        - Analytics and Reports
      `,
      contact: {
        name: 'Dzulfaqor Ali',
        email: 'dzulfaqor2003@gmail.com',
        url: 'https://github.com/dzulfaqorali196'
      },
      license: {
        name: 'ITB',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://virtual-physics-lab.vercel.app/api',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    security: [
      { bearerAuth: [] }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'User',
        description: 'User profile and preferences management'
      },
      {
        name: 'Experiments',
        description: 'Pendulum experiment data management'
      },
      {
        name: 'Learning',
        description: 'Learning progress and quiz results'
      }
    ],
    paths: {
      '/auth/[...nextauth]': {
        get: {
          tags: ['Authentication'],
          summary: 'NextAuth.js authentication handler',
          description: 'Handles OAuth authentication flows for Google and GitHub',
          parameters: [
            {
              in: 'query',
              name: 'provider',
              schema: {
                type: 'string',
                enum: ['google', 'github']
              },
              description: 'OAuth provider'
            }
          ],
          responses: {
            '200': {
              description: 'Authentication successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      },
                      accessToken: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Authentication failed',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/user/profile': {
        get: {
          tags: ['User'],
          summary: 'Get user profile',
          description: 'Retrieves the authenticated user\'s profile information',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        },
        put: {
          tags: ['User'],
          summary: 'Update user profile',
          description: 'Updates the authenticated user\'s profile information',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserUpdate'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      },
      '/user/experiments': {
        get: {
          tags: ['Experiments'],
          summary: 'Get user experiments',
          description: 'Retrieves all experiments conducted by the user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10
              },
              description: 'Maximum number of experiments to return'
            },
            {
              in: 'query',
              name: 'offset',
              schema: {
                type: 'integer',
                minimum: 0,
                default: 0
              },
              description: 'Number of experiments to skip'
            }
          ],
          responses: {
            '200': {
              description: 'List of experiments',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Experiment'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Experiments'],
          summary: 'Save experiment',
          description: 'Saves a new experiment result',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExperimentCreate'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Experiment saved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Experiment'
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            }
          }
        }
      },
      '/user/learning-progress': {
        get: {
          tags: ['Learning'],
          summary: 'Get learning progress',
          description: 'Retrieves user\'s learning progress and quiz scores',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Learning progress data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Progress'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Learning'],
          summary: 'Update learning progress',
          description: 'Updates user\'s learning progress and quiz scores',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProgressUpdate'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Progress updated successfully'
            },
            '400': {
              description: 'Invalid input'
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            name: {
              type: 'string',
              description: 'User\'s full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'User\'s profile image URL'
            },
            preferences: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  enum: ['light', 'dark', 'system'],
                  description: 'UI theme preference'
                },
                defaultLength: {
                  type: 'number',
                  description: 'Default pendulum length in meters'
                },
                defaultMass: {
                  type: 'number',
                  description: 'Default pendulum mass in kg'
                },
                defaultAngle: {
                  type: 'number',
                  description: 'Default initial angle in degrees'
                },
                view3D: {
                  type: 'boolean',
                  description: '3D view preference'
                }
              }
            },
            profile: {
              type: 'object',
              properties: {
                bio: {
                  type: 'string',
                  description: 'User biography'
                },
                institution: {
                  type: 'string',
                  description: 'Educational institution'
                },
                expertise: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Areas of expertise'
                },
                stats: {
                  type: 'object',
                  properties: {
                    experimentsCompleted: {
                      type: 'number',
                      description: 'Total completed experiments'
                    },
                    totalExperimentTime: {
                      type: 'number',
                      description: 'Total time spent on experiments (seconds)'
                    },
                    lastActive: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Last activity timestamp'
                    }
                  }
                }
              }
            }
          }
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string' },
            institution: { type: 'string' },
            expertise: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Experiment: {
          type: 'object',
          required: ['length', 'mass', 'angle', 'measurements'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            timestamp: {
              type: 'number',
              description: 'Unix timestamp of experiment'
            },
            length: {
              type: 'number',
              description: 'Pendulum length in meters'
            },
            mass: {
              type: 'number',
              description: 'Pendulum mass in kg'
            },
            angle: {
              type: 'number',
              description: 'Initial angle in radians'
            },
            duration: {
              type: 'number',
              description: 'Experiment duration in seconds'
            },
            measurements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: {
                    type: 'number',
                    description: 'Time point in seconds'
                  },
                  angle: {
                    type: 'number',
                    description: 'Angle at time point'
                  },
                  energy: {
                    type: 'number',
                    description: 'Total energy at time point'
                  }
                }
              }
            }
          }
        },
        ExperimentCreate: {
          type: 'object',
          required: ['length', 'mass', 'angle', 'measurements'],
          properties: {
            length: { type: 'number' },
            mass: { type: 'number' },
            angle: { type: 'number' },
            duration: { type: 'number' },
            measurements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'number' },
                  angle: { type: 'number' },
                  energy: { type: 'number' }
                }
              }
            }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            completedSections: {
              type: 'array',
              items: { type: 'string' },
              description: 'IDs of completed learning sections'
            },
            quizScores: {
              type: 'object',
              additionalProperties: {
                type: 'number'
              },
              description: 'Quiz scores by section ID'
            }
          }
        },
        ProgressUpdate: {
          type: 'object',
          properties: {
            completedSections: {
              type: 'array',
              items: { type: 'string' }
            },
            quizScores: {
              type: 'object',
              additionalProperties: {
                type: 'number'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Error code'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  };