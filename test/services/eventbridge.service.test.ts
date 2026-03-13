import { describe, it, expect, vi, beforeEach } from "vitest";
import { PutEventsCommand, PutRuleCommand, PutTargetsCommand } from "@aws-sdk/client-eventbridge";
import { EventBridgeService } from "../../src/services/eventbridge.service";

describe("EventBridgeService", () => {
  let service: EventBridgeService;
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    service = new EventBridgeService({
      send: sendMock,
    } as any);
  });

  describe("putEvents", () => {
    it("sends PutEventsCommand with given input", async () => {
      sendMock.mockResolvedValue({ Entries: [{ EventId: "evt-1" }], FailedEntryCount: 0 });
      const input = {
        Entries: [
          {
            Source: "my.app",
            DetailType: "OrderCreated",
            Detail: JSON.stringify({ orderId: "123" }),
          },
        ],
      };
      const result = await service.putEvents(input);
      expect(sendMock).toHaveBeenCalledTimes(1);
      const cmd = sendMock.mock.calls[0][0];
      expect(cmd).toBeInstanceOf(PutEventsCommand);
      expect(cmd.input).toEqual(input);
      expect(result.FailedEntryCount).toBe(0);
      expect(result.Entries).toHaveLength(1);
      expect(result.Entries![0].EventId).toBe("evt-1");
    });

    it("passes through multiple entries unchanged", async () => {
      sendMock.mockResolvedValue({
        Entries: [{ EventId: "a" }, { EventId: "b" }],
        FailedEntryCount: 0,
      });
      const input = {
        Entries: [
          { Source: "a", DetailType: "T1", Detail: "{}" },
          { Source: "b", DetailType: "T2", Detail: "{}" },
        ],
      };
      const result = await service.putEvents(input);
      expect(cmdInput().Entries).toHaveLength(2);
      expect(cmdInput().Entries[0].Source).toBe("a");
      expect(cmdInput().Entries[1].Source).toBe("b");
      expect(result.Entries).toHaveLength(2);
    });

    it("returns full response including FailedEntryCount and error info on Entries", async () => {
      sendMock.mockResolvedValue({
        Entries: [{ ErrorCode: "InternalException", ErrorMessage: "Bad" }],
        FailedEntryCount: 1,
      });
      const result = await service.putEvents({
        Entries: [{ Source: "x", DetailType: "T", Detail: "{}" }],
      });
      expect(result.FailedEntryCount).toBe(1);
      expect(result.Entries).toHaveLength(1);
      expect(result.Entries![0].ErrorCode).toBe("InternalException");
      expect(result.Entries![0].ErrorMessage).toBe("Bad");
    });

    it("passes EventBusName on entries when provided", async () => {
      sendMock.mockResolvedValue({ Entries: [], FailedEntryCount: 0 });
      await service.putEvents({
        Entries: [
          {
            Source: "s",
            DetailType: "T",
            Detail: "{}",
            EventBusName: "custom-bus",
          },
        ],
      });
      expect(cmdInput().Entries[0].EventBusName).toBe("custom-bus");
    });

    function cmdInput() {
      return sendMock.mock.calls[0][0].input;
    }
  });

  describe("putEvent", () => {
    it("sends single event with object detail (JSON stringified)", async () => {
      sendMock.mockResolvedValue({ Entries: [{ EventId: "evt-1" }], FailedEntryCount: 0 });
      await service.putEvent({
        Source: "my.app",
        DetailType: "UserSignedUp",
        Detail: { userId: "u-1", email: "u@example.com" },
      });
      expect(cmdInput().Entries).toHaveLength(1);
      expect(cmdInput().Entries[0].Source).toBe("my.app");
      expect(cmdInput().Entries[0].DetailType).toBe("UserSignedUp");
      expect(cmdInput().Entries[0].Detail).toBe('{"userId":"u-1","email":"u@example.com"}');
    });

    it("sends single event with string detail as-is", async () => {
      sendMock.mockResolvedValue({});
      const detail = '{"msg":"plain text"}';
      await service.putEvent({
        Source: "legacy",
        DetailType: "Raw",
        Detail: detail,
      });
      expect(cmdInput().Entries[0].Detail).toBe(detail);
    });

    it("stringifies empty object detail as '{}'", async () => {
      sendMock.mockResolvedValue({});
      await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: {},
      });
      expect(cmdInput().Entries[0].Detail).toBe("{}");
    });

    it("passes optional EventBusName to entry", async () => {
      sendMock.mockResolvedValue({});
      await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: "x",
        EventBusName: "my-custom-bus",
      });
      expect(cmdInput().Entries[0].EventBusName).toBe("my-custom-bus");
    });

    it("passes optional Time to entry", async () => {
      sendMock.mockResolvedValue({});
      const time = new Date("2025-01-15T12:00:00Z");
      await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: "x",
        Time: time,
      });
      expect(cmdInput().Entries[0].Time).toBe(time);
    });

    it("passes optional Resources to entry", async () => {
      sendMock.mockResolvedValue({});
      await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: "x",
        Resources: ["arn:aws:resource:123"],
      });
      expect(cmdInput().Entries[0].Resources).toEqual(["arn:aws:resource:123"]);
    });

    it("passes optional TraceHeader to entry", async () => {
      sendMock.mockResolvedValue({});
      await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: "x",
        TraceHeader: "trace-id-123",
      });
      expect(cmdInput().Entries[0].TraceHeader).toBe("trace-id-123");
    });

    it("returns putEvents response", async () => {
      sendMock.mockResolvedValue({
        Entries: [{ EventId: "e-1" }],
        FailedEntryCount: 0,
      });
      const result = await service.putEvent({
        Source: "s",
        DetailType: "T",
        Detail: "x",
      });
      expect(result.Entries).toHaveLength(1);
      expect(result.Entries![0].EventId).toBe("e-1");
      expect(result.FailedEntryCount).toBe(0);
    });

    it("calls putEvents once with single entry", async () => {
      sendMock.mockResolvedValue({});
      await service.putEvent({ Source: "s", DetailType: "T", Detail: "d" });
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(cmdInput().Entries).toHaveLength(1);
    });

    function cmdInput() {
      return sendMock.mock.calls[0][0].input;
    }
  });

  describe("putRule", () => {
    it("sends PutRuleCommand with Name and ScheduleExpression", async () => {
      sendMock.mockResolvedValue({ RuleArn: "arn:aws:events:us-east-1:123:rule/my-rule" });
      const input = {
        Name: "my-rule",
        ScheduleExpression: "rate(5 minutes)",
      };
      const result = await service.putRule(input);
      expect(sendMock).toHaveBeenCalledTimes(1);
      const cmd = sendMock.mock.calls[0][0];
      expect(cmd).toBeInstanceOf(PutRuleCommand);
      expect(cmd.input).toEqual(input);
      expect(result.RuleArn).toBe("arn:aws:events:us-east-1:123:rule/my-rule");
    });

    it("passes EventPattern and State when provided", async () => {
      sendMock.mockResolvedValue({ RuleArn: "arn:..." });
      const input = {
        Name: "event-rule",
        EventPattern: JSON.stringify({ source: ["my.app"] }),
        State: "ENABLED" as const,
      };
      await service.putRule(input);
      expect(cmdInput().EventPattern).toBe(input.EventPattern);
      expect(cmdInput().State).toBe("ENABLED");
    });

    it("passes Description and RoleArn when provided", async () => {
      sendMock.mockResolvedValue({ RuleArn: "arn:..." });
      await service.putRule({
        Name: "r",
        ScheduleExpression: "rate(1 day)",
        Description: "Daily job",
        RoleArn: "arn:aws:iam::123:role/EventsRole",
      });
      expect(cmdInput().Description).toBe("Daily job");
      expect(cmdInput().RoleArn).toBe("arn:aws:iam::123:role/EventsRole");
    });

    it("passes EventBusName when provided", async () => {
      sendMock.mockResolvedValue({ RuleArn: "arn:..." });
      await service.putRule({
        Name: "r",
        ScheduleExpression: "cron(0 12 * * ? *)",
        EventBusName: "custom-bus",
      });
      expect(cmdInput().EventBusName).toBe("custom-bus");
    });

    it("returns RuleArn from response", async () => {
      sendMock.mockResolvedValue({ RuleArn: "arn:aws:events:us-west-2:456:rule/scheduled" });
      const result = await service.putRule({
        Name: "scheduled",
        ScheduleExpression: "rate(10 minutes)",
      });
      expect(result.RuleArn).toBe("arn:aws:events:us-west-2:456:rule/scheduled");
    });

    function cmdInput() {
      return sendMock.mock.calls[0][0].input;
    }
  });

  describe("putTargets", () => {
    it("sends PutTargetsCommand with Rule and Targets", async () => {
      sendMock.mockResolvedValue({ FailedEntryCount: 0 });
      const input = {
        Rule: "my-rule",
        Targets: [{ Id: "1", Arn: "arn:aws:sqs:us-east-1:123:queue/my-queue" }],
      };
      const result = await service.putTargets(input);
      expect(sendMock).toHaveBeenCalledTimes(1);
      const cmd = sendMock.mock.calls[0][0];
      expect(cmd).toBeInstanceOf(PutTargetsCommand);
      expect(cmd.input.Rule).toBe("my-rule");
      expect(cmd.input.Targets).toEqual(input.Targets);
      expect(result.FailedEntryCount).toBe(0);
    });

    it("passes multiple targets", async () => {
      sendMock.mockResolvedValue({ FailedEntryCount: 0 });
      const targets = [
        { Id: "1", Arn: "arn:aws:sqs:us-east-1:123:queue/q1" },
        { Id: "2", Arn: "arn:aws:lambda:us-east-1:123:function:f1" },
      ];
      await service.putTargets({ Rule: "r", Targets: targets });
      expect(cmdInput().Targets).toHaveLength(2);
      expect(cmdInput().Targets[0].Id).toBe("1");
      expect(cmdInput().Targets[1].Arn).toContain("lambda");
    });

    it("passes EventBusName when provided", async () => {
      sendMock.mockResolvedValue({ FailedEntryCount: 0 });
      await service.putTargets({
        Rule: "r",
        EventBusName: "custom-bus",
        Targets: [{ Id: "1", Arn: "arn:aws:sqs:us-east-1:123:queue/q" }],
      });
      expect(cmdInput().EventBusName).toBe("custom-bus");
    });

    it("returns FailedEntryCount and FailedEntries from response", async () => {
      sendMock.mockResolvedValue({
        FailedEntryCount: 1,
        FailedEntries: [
          { TargetId: "1", ErrorCode: "BadArn", ErrorMessage: "Invalid" },
        ],
      });
      const result = await service.putTargets({
        Rule: "r",
        Targets: [{ Id: "1", Arn: "invalid" }],
      });
      expect(result.FailedEntryCount).toBe(1);
      expect(result.FailedEntries).toHaveLength(1);
      expect(result.FailedEntries![0].TargetId).toBe("1");
      expect(result.FailedEntries![0].ErrorCode).toBe("BadArn");
    });

    it("passes input through unchanged", async () => {
      sendMock.mockResolvedValue({ FailedEntryCount: 0 });
      const input = {
        Rule: "scheduled-rule",
        Targets: [
          {
            Id: "lambda-target",
            Arn: "arn:aws:lambda:us-east-1:999:function:handler",
            RoleArn: "arn:aws:iam::999:role/EventsInvoke",
          },
        ],
      };
      await service.putTargets(input);
      expect(cmdInput().Rule).toBe("scheduled-rule");
      expect(cmdInput().Targets[0].RoleArn).toBe("arn:aws:iam::999:role/EventsInvoke");
    });

    function cmdInput() {
      return sendMock.mock.calls[0][0].input;
    }
  });
});
