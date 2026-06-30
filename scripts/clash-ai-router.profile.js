// Clash AI Router profile script for Clash Verge Rev / Mihomo.
// Paste this into a Profile Script, or install it with bin/clash-ai-router.
//
// It creates stable AI routing groups while keeping real node choices dynamic.
// It does not contain subscription URLs or private node data.
// It only filters costly nodes inside the groups it creates; it does not delete
// nodes from your original subscription or unrelated proxy groups.
// CLASH_AI_ROUTER_PROFILE_SCRIPT_V1

function main(config, profileName) {
  const names = {
    aiAuto: "AI自动可用",
    aiSelect: "AI代理",
    foreignAuto: "国外自动可用",
    foreignSelect: "普通国外",
  };

  const costlyNodePattern =
    /(?:\b(?:[5-9]|[1-9]\d+)(?:\.0+)?x\b|(?:[5-9]|[1-9]\d+)(?:\.0+)?倍(?:流量)?|高倍|高倍率|昂贵|贵)/i;
  const aiNodePatterns = [
    /ChatGPT/i,
    /OpenAI/i,
    /Claude/i,
    /Gemini/i,
    /住宅|静态|家宽|ISP|Residential|Static/i,
  ];
  const normalNodePatterns = [
    /PRO|Hy2|OPT|公益|香港|日本|新加坡|美国|台湾|英国|德国|HK|JP|SG|US/i,
  ];

  // Practical default list, not an official policy list. Edit to fit your services.
  const allowedAiRegionPattern =
    /台湾|Taiwan|日本|Japan|美国|United\s*States|USA|\bUS\b|韩国|South\s*Korea|德国|Germany|英国|United\s*Kingdom|UK|巴西|Brazil|澳大利亚|Australia|悉尼|Sydney|新加坡|Singapore|越南|Vietnam|马来西亚|Malaysia/i;
  const blockedAiRegionPattern =
    /中国|China|香港|Hong\s*Kong|\bHK\b|澳门|Macau|Russia|俄罗斯|Vladivostok|Moscow|莫斯科|白俄罗斯|Belarus|Iran|伊朗|North\s*Korea|朝鲜|Syria|叙利亚|Cuba|古巴|Venezuela|委内瑞拉/i;

  const unique = (items) =>
    items.filter((item, index, array) => item && array.indexOf(item) === index);

  const proxyList = Array.isArray(config.proxies) ? config.proxies : [];
  const proxyNames = proxyList.map((proxy) => proxy.name).filter(Boolean);
  const nonCostlyProxyNames = proxyNames.filter(
    (name) => !costlyNodePattern.test(name)
  );
  const pickNodes = (patterns) =>
    proxyNames.filter((name) => patterns.some((pattern) => pattern.test(name)));

  const isAllowedAiNode = (name) =>
    !costlyNodePattern.test(name) &&
    allowedAiRegionPattern.test(name) &&
    !blockedAiRegionPattern.test(name);

  const aiNodes = pickNodes(aiNodePatterns).filter(isAllowedAiNode);
  const normalNodes = pickNodes(normalNodePatterns);
  const safeForeignNodes = unique(normalNodes.filter(isAllowedAiNode));
  const expandedAiNodes = unique([...aiNodes, ...safeForeignNodes]);

  // If no recommended AI node can be identified from names, keep the config valid
  // by using non-costly nodes. The helper's `test --strict` will still fail and
  // ask the user to check node naming or choose a node manually.
  const fallbackNodes = expandedAiNodes.length
    ? expandedAiNodes
    : nonCostlyProxyNames;
  const finalFallbackNodes = fallbackNodes.length ? fallbackNodes : ["DIRECT"];

  const previousGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];
  const previousGroup = (name) =>
    previousGroups.find((group) => group && group.name === name) || {};
  const previousChoices = (name) =>
    Array.isArray(previousGroup(name).proxies) ? previousGroup(name).proxies : [];

  config["proxy-groups"] = previousGroups.filter(
    (group) =>
      ![
        names.aiAuto,
        names.aiSelect,
        names.foreignAuto,
        names.foreignSelect,
      ].includes(group.name)
  );

  const normalChoices = unique([names.foreignAuto, ...safeForeignNodes]);

  config["proxy-groups"].unshift(
    {
      ...previousGroup(names.aiAuto),
      name: names.aiAuto,
      type: "url-test",
      proxies: finalFallbackNodes,
      url: previousGroup(names.aiAuto).url || "https://chatgpt.com/cdn-cgi/trace",
      interval: previousGroup(names.aiAuto).interval || 300,
      tolerance: previousGroup(names.aiAuto).tolerance || 80,
      lazy: previousGroup(names.aiAuto).lazy ?? true,
    },
    {
      ...previousGroup(names.aiSelect),
      name: names.aiSelect,
      type: "select",
      proxies: unique([
        names.aiAuto,
        ...expandedAiNodes,
        ...previousChoices(names.aiSelect).filter(
          (name) => !costlyNodePattern.test(name)
        ),
      ]),
    },
    {
      ...previousGroup(names.foreignAuto),
      name: names.foreignAuto,
      type: "url-test",
      proxies: safeForeignNodes.length ? safeForeignNodes : finalFallbackNodes,
      url: previousGroup(names.foreignAuto).url || "http://cp.cloudflare.com/generate_204",
      interval: previousGroup(names.foreignAuto).interval || 300,
      tolerance: previousGroup(names.foreignAuto).tolerance || 80,
      lazy: previousGroup(names.foreignAuto).lazy ?? true,
    },
    {
      ...previousGroup(names.foreignSelect),
      name: names.foreignSelect,
      type: "select",
      proxies: unique([
        ...(normalChoices.length ? normalChoices : finalFallbackNodes),
        ...previousChoices(names.foreignSelect).filter(
          (name) => !costlyNodePattern.test(name)
        ),
      ]),
    }
  );

  const aiRules = [
    "DOMAIN-SUFFIX,openai.com," + names.aiSelect,
    "DOMAIN-SUFFIX,chatgpt.com," + names.aiSelect,
    "DOMAIN-SUFFIX,oaistatic.com," + names.aiSelect,
    "DOMAIN-SUFFIX,oaiusercontent.com," + names.aiSelect,
    "DOMAIN-SUFFIX,openaiusercontent.com," + names.aiSelect,
    "DOMAIN-SUFFIX,auth0.openai.com," + names.aiSelect,
    "DOMAIN-SUFFIX,anthropic.com," + names.aiSelect,
    "DOMAIN-SUFFIX,claude.ai," + names.aiSelect,
    "DOMAIN-SUFFIX,gemini.google.com," + names.aiSelect,
    "DOMAIN-SUFFIX,aistudio.google.com," + names.aiSelect,
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com," + names.aiSelect,
    "DOMAIN-SUFFIX,ai.google.dev," + names.aiSelect,
    "DOMAIN-SUFFIX,perplexity.ai," + names.aiSelect,
    "DOMAIN-SUFFIX,poe.com," + names.aiSelect,
    "DOMAIN-SUFFIX,cursor.com," + names.aiSelect,
    "DOMAIN-SUFFIX,cursor.sh," + names.aiSelect,
    "DOMAIN-SUFFIX,githubcopilot.com," + names.aiSelect,
  ];

  const directRules = [
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,localhost,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,224.0.0.0/4,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve",
    "GEOIP,CN,DIRECT",
  ];

  const preferredRules = [...aiRules, ...directRules];
  const existingRules = Array.isArray(config.rules) ? config.rules : [];
  const preferredKeys = new Set(
    preferredRules.map((rule) => rule.split(",").slice(0, 2).join(","))
  );

  config.rules = [
    ...preferredRules,
    ...existingRules.filter((rule) => {
      const key = String(rule).split(",").slice(0, 2).join(",");
      return !preferredKeys.has(key);
    }),
  ];

  return config;
}
