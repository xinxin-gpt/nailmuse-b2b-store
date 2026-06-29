# B2B 美甲 / 穿戴甲独立站架构

## 1. 访问层

```text
客户 / Google / 海外采购商
          ↓
Namecheap 域名 DNS
          ↓
Vercel 全球网络
```

## 2. 应用层

```text
Next.js App Router
├── /                         B2B首页
├── /products                 动态产品目录
├── /products/[slug]          动态产品详情
├── /oem-odm                  OEM/ODM定制
├── /wholesale                批发合作
├── /factory                  工厂实力
├── /catalog                  目录下载
├── /contact                  询盘
├── /admin/import             受密码保护的批量导入后台
├── /api/products             公开产品JSON接口
├── /api/admin/products       管理端产品接口
├── /api/admin/products/import CSV/XLSX预检与发布
└── /api/inquiry              询盘邮件接口
```

## 3. 数据层

```text
Cloudflare R2 Bucket
├── catalog/products.json
│   └── 当前产品库
├── catalog/backups/
│   └── Replace/更新前自动备份
├── products/
│   └── 产品主图和详情图
└── catalogs/
    └── PDF产品目录
```

产品内容不写入 Vercel 临时文件系统。管理员发布产品时，Vercel Serverless API 使用 R2 S3 API 写入 `catalog/products.json`；前台页面在请求时读取该目录。

如果 R2 未配置或暂时不可用，网站回退到 `data/products.ts` 中的8个示例产品。

## 4. 批量导入流程

```text
CSV / XLSX
    ↓
/admin/import
    ↓
管理员Token校验
    ↓
字段映射与标准化
    ↓
必填字段、图片URL、重复SKU/slug检查
    ↓
预览错误与警告
    ↓
Upsert 或 Replace
    ↓
旧目录自动备份
    ↓
R2 catalog/products.json
    ↓
前台产品页立即读取
```

## 5. 图片流程

```text
本地图片文件夹
    ↓ npm run r2:upload
Cloudflare R2 products/
    ↓
r2-upload-manifest.csv
    ↓
复制URL到产品导入表格
```

## 6. 安全边界

- R2密钥仅保存在 Vercel Environment Variables
- 管理导入接口要求 Bearer Token
- `/admin/` 和 `/api/admin/` 已禁止搜索引擎抓取
- 管理密码不进入产品文件
- 只接受 CSV / XLSX，最大4MB
- 图片只保存 HTTPS 地址或站内相对路径，不自动抓取第三方图片
- 公开前台只显示 `status=published` 产品

## 7. GitHub 的作用

GitHub 保存：

- 网站源代码
- 页面结构和样式
- 产品字段规则
- 导入逻辑
- 示例产品
- 部署文档

日常新增和更新产品不需要修改 GitHub。只有修改页面、功能、品牌设计或导入规则时，才需要提交代码并触发 Vercel 重新部署。
