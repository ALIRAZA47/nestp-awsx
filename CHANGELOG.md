# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added

- AwsxModule with forRoot and forRootAsync
- S3, SQS, SES, Route53 services
- Global and per-service credential configuration (default, profile, static)
- S3: putObject, getObject, putJson, getJson, exists, listKeys, deleteObject, putMany, uploadWithProgress, getSignedUrl
- SQS: sendMessage, sendJson, receiveMessages, receiveJson, sendJsonBatch, deleteMessage, purgeQueue
- SES: sendEmail, sendTextEmail, sendHtmlEmail
- Route53: changeRecordSets, listHostedZones, upsertARecord, upsertTxtRecord
- CLI: `awsx setup`, `awsx install`, `awsx init`
