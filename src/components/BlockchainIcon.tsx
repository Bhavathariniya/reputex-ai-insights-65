
import React from 'react';
import { BlockchainType } from '@/utils/addressUtils';
import { Bitcoin, Disc, Database, CheckCircle2, CircleEllipsis, Network } from 'lucide-react';

interface BlockchainIconProps {
  chain: BlockchainType;
  size?: number;
  className?: string;
}

const BlockchainIcon: React.FC<BlockchainIconProps> = ({ chain, size = 16, className = "" }) => {
  // Custom styling based on blockchain
  const getIconByChain = () => {
    switch (chain) {
      case 'ethereum':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#627EEA" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" fillRule="evenodd" d="M16.498 4v8.87l7.497 3.35z" opacity=".6" />
            <path fill="#FFF" fillRule="evenodd" d="M16.498 4L9 16.22l7.498-3.35z" />
            <path fill="#FFF" fillRule="evenodd" d="M16.498 21.968v6.027L24 17.616z" opacity=".6" />
            <path fill="#FFF" fillRule="evenodd" d="M16.498 27.995v-6.028L9 17.616z" />
            <path fill="#FFF" fillRule="evenodd" d="M16.498 20.573l7.497-4.353-7.497-3.348z" opacity=".2" />
            <path fill="#FFF" fillRule="evenodd" d="M9 16.22l7.498 4.353v-7.701z" opacity=".6" />
          </svg>
        );
      case 'binance':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#F3BA2F" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M12.12 14.32v3.36L16 20.16l3.88-2.48v-3.36L16 11.84l-3.88 2.48zM6.24 11.84v8.32L10.12 22.64l3.88-2.48V16.8l-3.88 2.48v-3.36l-3.88-2.48v-1.6zM21.88 11.84l-3.88 2.48v3.36l3.88-2.48v3.36l3.88 2.48v-8.32l-3.88-2.48zM21.88 8.48l-3.88-2.48-3.88 2.48 3.88 2.48 3.88-2.48zM10.12 8.48L6.24 6 2.36 8.48l3.88 2.48 3.88-2.48zM10.12 26l3.88 2.48L17.88 26l-3.88-2.48-3.88 2.48zM21.88 8.48l-3.88 2.48 3.88 2.48 3.88-2.48-3.88-2.48zM25.76 26l3.88-2.48-3.88-2.48-3.88 2.48L25.76 26z" />
          </svg>
        );
      case 'polygon':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#8247E5" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M21.092 12.693c-.476-.286-1.089-.286-1.613 0l-2.926 1.712-1.966 1.094-2.925 1.712c-.476.286-1.089.286-1.613 0l-2.277-1.331c-.476-.286-.795-.808-.795-1.379V11.27c0-.57.286-1.094.795-1.38l2.277-1.331c.476-.285 1.089-.285 1.613 0l2.277 1.332c.476.285.795.808.795 1.379v1.712l1.966-1.142v-1.712c0-.57-.286-1.094-.795-1.379l-4.243-2.474c-.476-.286-1.089-.286-1.613 0l-4.347 2.474c-.53.285-.82.808-.82 1.379v4.947c0 .57.29 1.094.82 1.38l4.347 2.473c.477.286 1.09.286 1.613 0l2.926-1.712 1.966-1.094 2.925-1.713c.477-.285 1.09-.285 1.613 0l2.278 1.332c.476.285.795.808.795 1.379v2.284c0 .57-.29 1.094-.795 1.379l-2.278 1.332c-.476.285-1.089.285-1.613 0l-2.277-1.332c-.476-.285-.795-.808-.795-1.379v-1.712l-1.966 1.142v1.712c0 .57.286 1.093.795 1.379l4.306 2.473c.476.286 1.089.286 1.613 0l4.306-2.473c.476-.286.795-.809.795-1.38V14.07c0-.57-.286-1.094-.795-1.379l-2.34-1.331z" />
          </svg>
        );
      case 'bitcoin':
        return <Bitcoin size={size} className={className} />;
      case 'solana':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#00FFA3" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M9.925 19.687a.608.608 0 01.424-.17h14.84c.263 0 .395.317.211.502l-2.603 2.607a.608.608 0 01-.424.17H7.532a.304.304 0 01-.212-.502l2.605-2.607zm0-9.799a.608.608 0 01.424-.17h14.84c.263 0 .395.317.211.502l-2.603 2.607a.608.608 0 01-.424.17H7.532a.304.304 0 01-.212-.502l2.605-2.607zm16.448 4.826a.304.304 0 01-.212.502H11.322a.608.608 0 01-.424-.17l-2.604-2.607a.304.304 0 01.212-.502h14.84c.16 0 .314.064.424.17l2.603 2.607z" />
          </svg>
        );
      case 'avalanche':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#E84142" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M21.131 17.855h3.394l-5.232 8.18H15.5l-1.759-2.824H13.7l1.759 2.823h-3.394l-5.233-8.179h3.394l3.473 5.356 1.759-2.846-1.759-2.51h3.394l3.473 5.356 1.565-2.534z" />
          </svg>
        );
      case 'fantom':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#1969FF" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M17.2 12.9l2.8-1.6v3.3l-2.8 1.6v-3.3zm0 10.2l2.8-1.6v-6.7L17.2 16v7.1zm-1-14.3l2.8 1.6-2.8 1.6-2.8-1.6 2.8-1.6zm-4.7 2.7l2.8 1.6v3.3l-2.8-1.6v-3.3zm0 8.6l2.8 1.6v-7.1l-2.8-1.6v7.1zm4.7 2.7l-2.8-1.6 2.8-1.6 2.8 1.6-2.8 1.6z" />
          </svg>
        );
      case 'base':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#0052FF" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" fillRule="evenodd" d="M16 27c6.075 0 11-4.925 11-11S22.075 5 16 5 5 9.925 5 16s4.925 11 11 11zm0-4.4a6.6 6.6 0 100-13.2 6.6 6.6 0 000 13.2z" clipRule="evenodd" />
          </svg>
        );
      case 'zksync':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#8C8DFC" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M19.227 13.04l-5.348 5.346-1.796-1.796 5.348-5.346 1.796 1.796z" />
            <path fill="#FFF" d="M21.044 17.492l-7.156 1.254-.394-2.267 7.156-1.253.394 2.266zM13.506 11.47l1.254 7.156-2.267.394-1.254-7.156 2.267-.394z" />
          </svg>
        );
      case 'optimism':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#FF0420" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M10.886 11.616c1.478-1.388 3.116-1.791 4.916-1.791 4.38 0 7.356 3.221 7.356 7.6 0 4.403-3.085 7.706-7.428 7.706-1.8 0-3.438-.413-4.915-1.801v6.162H7.2V10.033h3.686v1.583zm4.844 10.144c2.59 0 4.37-1.92 4.37-4.335 0-2.39-1.78-4.311-4.37-4.311-2.582 0-4.362 1.92-4.362 4.311 0 2.414 1.78 4.335 4.362 4.335z" />
          </svg>
        );
      case 'arbitrum':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <path fill="#28A0F0" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
            <path fill="#FFF" d="M15.372 17.594l-1.176-3.89H8.012l7.36 16.319 7.36-16.319h-6.184l-1.176 3.89z" />
          </svg>
        );
      case 'l1x':
        // Custom L1X icon (placeholder)
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill="#FF00FF" />
            <path fill="#FFF" d="M8 12l4 4-4 4h16l-4-4 4-4z" />
          </svg>
        );
      default:
        return <Network size={size} className={className} />;
    }
  };

  return (
    <div className="inline-flex items-center justify-center">
      {getIconByChain()}
    </div>
  );
};

export default BlockchainIcon;
