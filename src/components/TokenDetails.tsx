import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Users, 
  Calendar, 
  DollarSign,
  ArrowRight,
  Info,
  Lock,
  Star,
  CircleCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BlockchainIcon from './BlockchainIcon';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { BlockchainType } from '@/utils/addressUtils';  // Import BlockchainType

interface TokenDetailsProps {
  tokenName?: string;
  network?: BlockchainType;  // Change network to BlockchainType
  contractAddress?: string;
  creationDate?: string;
  creator?: string;
  auditStatus?: string;
  category?: string;
  riskRating?: number;
  overallScore?: number;
  lastUpdated?: string;
  holders?: string;
  totalSupply?: string;
  exchanges?: string[];
  price?: string;
  todayHigh?: string;
  todayLow?: string;
  marketCap?: string;
  totalChecks?: string;
  criticalIssues?: number;
  riskyIssues?: number;
  mediumRiskIssues?: number;
  neutralIssues?: number;
  niceToHaveFeatures?: number;
  goodToHaveFeatures?: number;
  greatToHaveFeatures?: number;
  unavailableChecks?: number;
  codeChecksCompleted?: string;
  codeMaxScore?: number;
  codeMinScore?: number;
  codeScore?: number;
  ownershipPermissions?: string[];
  additionalInfo?: string[];
}

const ScoreBar = ({ value, max, color = 'bg-neon-cyan', showPercentage = true }: { 
  value: number, 
  max: number, 
  color?: string,
  showPercentage?: boolean
}) => {
  const percentage = Math.floor((value / max) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{value}/{max}</span>
        {showPercentage && <span className="text-sm font-medium">{percentage}%</span>}
      </div>
      <Progress 
        value={percentage} 
        className="h-2 bg-muted/50"
        indicatorClassName={`${color}`}
      />
    </div>
  );
};

const RiskLevelItem = ({ 
  level, 
  count, 
  color,
  textColor
}: { 
  level: string, 
  count: number, 
  color: string,
  textColor: string
}) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className={`text-sm ${textColor}`}>{level}</span>
    </div>
    <span className="text-sm font-semibold">{count}</span>
  </div>
);

const TokenDetails: React.FC<TokenDetailsProps> = ({
  tokenName = "Defiant",
  network = "solana", // This was a raw string, now explicitly typed
  contractAddress = "DPTP4fUfWuwVTgCmt...eCTBjc2YKgpDpump",
  creationDate = "Apr 16, 2025",
  creator = "82J2Hqcfp1TLeoGdB...e6G2vLYx5LgmwRRw",
  auditStatus = "Coming Soon",
  category = "",
  riskRating = 0,
  overallScore = 250,
  lastUpdated = "Apr 17, 2025 2:37 PM",
  holders = "3.06K",
  totalSupply = "1B",
  exchanges = [],
  price = "$0.02",
  todayHigh = "",
  todayLow = "",
  marketCap = "$19.4M",
  totalChecks = "10/11",
  criticalIssues = 0,
  riskyIssues = 0,
  mediumRiskIssues = 0,
  neutralIssues = 1,
  niceToHaveFeatures = 5,
  goodToHaveFeatures = 2,
  greatToHaveFeatures = 2,
  unavailableChecks = 1,
  codeChecksCompleted = "4/4",
  codeMaxScore = 80,
  codeMinScore = -80,
  codeScore = 80,
  ownershipPermissions = [
    "Token Minting Authority is Disabled",
    "Token Freezing Authority is Disabled",
    "Token Metadata is Immutable"
  ],
  additionalInfo = [
    "Transfer Fee is not Modifiable"
  ]
}) => {
  const maxOverallScore = 300;
  const overallScorePercentage = Math.floor((overallScore / maxOverallScore) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center">
              <span className="text-xl font-bold text-white">{tokenName?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-text">{tokenName}</h1>
              <div className="flex items-center gap-2">
                <BlockchainIcon chain={network} size={16} />
                <span className="text-sm font-medium">{network.charAt(0).toUpperCase() + network.slice(1)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="px-3 py-1 bg-muted/30">
              <DollarSign className="h-3 w-3 mr-1 text-neon-green" />
              {price}
            </Badge>
            <div className="text-xs text-muted-foreground text-right">
              Market Cap: {marketCap}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contract Address</h3>
              <div className="flex items-center gap-2">
                <code className="bg-muted/30 px-2 py-1 rounded text-sm font-mono">{contractAddress}</code>
                <a href="#" className="text-neon-cyan hover:text-neon-blue">
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neon-purple" />
                  <span>{creationDate}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Creator</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neon-pink" />
                  <code className="bg-muted/30 px-2 py-1 rounded text-xs font-mono truncate max-w-[150px]">{creator}</code>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Holders</h3>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neon-blue" />
                  <span>{holders}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Supply</h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-neon-green" />
                  <span>{totalSupply}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-muted/10 to-muted/30">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
              <Shield className="h-5 w-5 text-neon-cyan" />
              Overall Score
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm">This score represents the overall quality and safety of the token based on code analysis, market metrics, and other factors.</p>
                </HoverCardContent>
              </HoverCard>
            </h3>
            
            <div className="text-2xl font-bold text-center my-4">
              <span className="text-neon-cyan">{overallScore}</span>
              <span className="text-sm text-muted-foreground">/{maxOverallScore}</span>
              <div className="text-lg">{overallScorePercentage}%</div>
            </div>
            
            <ScoreBar value={overallScore} max={maxOverallScore} color="bg-neon-cyan" />
            
            <div className="mt-4 text-xs text-muted-foreground text-right">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-muted/30 bg-muted/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-neon-pink" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">Total Checks: {totalChecks}</div>
              
              <RiskLevelItem level="Critical" count={criticalIssues} color="bg-red-500" textColor="text-red-500" />
              <RiskLevelItem level="Risky" count={riskyIssues} color="bg-orange-500" textColor="text-orange-500" />
              <RiskLevelItem level="Medium Risk" count={mediumRiskIssues} color="bg-yellow-500" textColor="text-yellow-500" />
              <RiskLevelItem level="Neutral" count={neutralIssues} color="bg-blue-500" textColor="text-blue-500" />
              <RiskLevelItem level="Nice To Have" count={niceToHaveFeatures} color="bg-green-300" textColor="text-green-500" />
              <RiskLevelItem level="Good To Have" count={goodToHaveFeatures} color="bg-green-500" textColor="text-green-500" />
              <RiskLevelItem level="Great To Have" count={greatToHaveFeatures} color="bg-green-700" textColor="text-green-600" />
              <RiskLevelItem level="Unavailable" count={unavailableChecks} color="bg-gray-400" textColor="text-gray-400" />
            </CardContent>
          </Card>
          
          <Card className="border border-muted/30 bg-muted/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-neon-cyan" />
                Code Score: {Math.floor((codeScore / codeMaxScore) * 100)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">Code Checks: {codeChecksCompleted}</div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Min: {codeMinScore}</span>
                <span>Max: {codeMaxScore}</span>
              </div>
              <ScoreBar value={codeScore} max={codeMaxScore} color="bg-neon-blue" showPercentage={false} />
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-neon-purple" />
                  Ownership Permissions
                </h4>
                <ul className="space-y-2">
                  {ownershipPermissions.map((permission, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-neon-green" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted/30 bg-muted/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-neon-blue" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditStatus && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium">Audits</h4>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Badge variant="outline" className="border-neon-purple text-neon-purple">
                      {auditStatus}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="mb-3">
                <h4 className="text-sm font-medium">Additional Checks</h4>
                <ul className="space-y-2 mt-1">
                  {additionalInfo.map((info, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CircleCheck className="h-4 w-4 text-neon-green" />
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
              
              {exchanges && exchanges.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Listed Exchanges</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exchanges.map((exchange, index) => (
                      <Badge key={index} variant="secondary" className="bg-muted/20">
                        {exchange}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
