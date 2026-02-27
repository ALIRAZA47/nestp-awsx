import { describe, it, expect, vi, beforeEach } from "vitest";
import { SesService } from "./ses.service";

describe("SesService", () => {
  let sesService: SesService;
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    sesService = new SesService({ send: sendMock } as any);
  });

  describe("sendEmail", () => {
    it("sends email with full params", async () => {
      sendMock.mockResolvedValue({ MessageId: "msg-1" });
      const result = await sesService.sendEmail({
        Source: "from@example.com",
        Destination: { ToAddresses: ["to@example.com"] },
        Message: {
          Subject: { Data: "Test" },
          Body: { Text: { Data: "Hello" } },
        },
      });
      expect(result.MessageId).toBe("msg-1");
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("sendTextEmail", () => {
    it("builds correct SendEmail params", async () => {
      sendMock.mockResolvedValue({});
      await sesService.sendTextEmail({
        from: "sender@example.com",
        to: ["recipient@example.com"],
        subject: "Test Subject",
        text: "Plain text body",
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Source).toBe("sender@example.com");
      expect(call.input.Destination.ToAddresses).toEqual(["recipient@example.com"]);
      expect(call.input.Message.Subject.Data).toBe("Test Subject");
      expect(call.input.Message.Body.Text.Data).toBe("Plain text body");
    });

    it("includes cc, bcc, replyTo when provided", async () => {
      sendMock.mockResolvedValue({});
      await sesService.sendTextEmail({
        from: "sender@example.com",
        to: ["to@example.com"],
        subject: "S",
        text: "T",
        cc: ["cc@example.com"],
        bcc: ["bcc@example.com"],
        replyTo: ["reply@example.com"],
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Destination.CcAddresses).toEqual(["cc@example.com"]);
      expect(call.input.Destination.BccAddresses).toEqual(["bcc@example.com"]);
      expect(call.input.ReplyToAddresses).toEqual(["reply@example.com"]);
    });
  });

  describe("sendHtmlEmail", () => {
    it("builds params with HTML body", async () => {
      sendMock.mockResolvedValue({});
      await sesService.sendHtmlEmail({
        from: "sender@example.com",
        to: ["to@example.com"],
        subject: "HTML Email",
        html: "<p>Hello</p>",
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Message.Body.Html.Data).toBe("<p>Hello</p>");
      expect(call.input.Message.Body.Text).toBeUndefined();
    });

    it("includes textFallback when provided", async () => {
      sendMock.mockResolvedValue({});
      await sesService.sendHtmlEmail({
        from: "sender@example.com",
        to: ["to@example.com"],
        subject: "S",
        html: "<p>Hi</p>",
        textFallback: "Hi",
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.Message.Body.Text.Data).toBe("Hi");
    });
  });
});
