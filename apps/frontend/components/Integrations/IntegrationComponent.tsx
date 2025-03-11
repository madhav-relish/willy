'use client'
import React from 'react'
import { IntegrationCard } from './IntegrationCard'
import { integrations } from '@/lib/constants'

type Props = {}

const IntegrationsComponent = (props: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
            {integrations.map((integration) => (
                <IntegrationCard key={integration.name} name={integration.name} logo={integration.logo} description={integration.description} />
            ))}
        </div>
    )
}

export default IntegrationsComponent