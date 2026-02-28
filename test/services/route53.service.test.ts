import { describe, it, expect, vi, beforeEach } from "vitest";
import { Route53Service } from "../../src/services/route53.service";

describe("Route53Service", () => {
  let route53Service: Route53Service;
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    route53Service = new Route53Service({ send: sendMock } as any);
  });

  describe("changeRecordSets", () => {
    it("sends change command", async () => {
      sendMock.mockResolvedValue({ ChangeInfo: { Id: "change-1" } });
      const result = await route53Service.changeRecordSets({
        HostedZoneId: "Z123",
        ChangeBatch: {
          Changes: [
            {
              Action: "CREATE",
              ResourceRecordSet: {
                Name: "test.example.com",
                Type: "A",
                TTL: 60,
                ResourceRecords: [{ Value: "1.2.3.4" }],
              },
            },
          ],
        },
      });
      expect(result.ChangeInfo.Id).toBe("change-1");
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("listHostedZones", () => {
    it("returns hosted zones", async () => {
      sendMock.mockResolvedValue({
        HostedZones: [
          { Id: "Z1", Name: "example.com." },
        ],
      });
      const result = await route53Service.listHostedZones({});
      expect(result.HostedZones).toHaveLength(1);
      expect(result.HostedZones![0].Name).toBe("example.com.");
    });
  });

  describe("upsertARecord", () => {
    it("builds correct ChangeBatch with UPSERT", async () => {
      sendMock.mockResolvedValue({});
      await route53Service.upsertARecord({
        zoneId: "Z123",
        name: "api.example.com",
        values: ["1.2.3.4", "5.6.7.8"],
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.HostedZoneId).toBe("Z123");
      expect(call.input.ChangeBatch.Changes[0].Action).toBe("UPSERT");
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.Type).toBe("A");
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.Name).toBe("api.example.com");
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.TTL).toBe(60);
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.ResourceRecords).toEqual([
        { Value: "1.2.3.4" },
        { Value: "5.6.7.8" },
      ]);
    });

    it("uses custom ttl when provided", async () => {
      sendMock.mockResolvedValue({});
      await route53Service.upsertARecord({
        zoneId: "Z123",
        name: "test.example.com",
        values: ["1.2.3.4"],
        ttl: 300,
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.TTL).toBe(300);
    });
  });

  describe("upsertTxtRecord", () => {
    it("builds correct ChangeBatch with TXT type", async () => {
      sendMock.mockResolvedValue({});
      await route53Service.upsertTxtRecord({
        zoneId: "Z123",
        name: "_acme.example.com",
        values: ['"verification-value"'],
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.Type).toBe("TXT");
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.TTL).toBe(300);
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.ResourceRecords).toEqual([
        { Value: '"verification-value"' },
      ]);
    });

    it("uses custom ttl when provided", async () => {
      sendMock.mockResolvedValue({});
      await route53Service.upsertTxtRecord({
        zoneId: "Z123",
        name: "txt.example.com",
        values: ["value"],
        ttl: 600,
      });
      const call = sendMock.mock.calls[0][0];
      expect(call.input.ChangeBatch.Changes[0].ResourceRecordSet.TTL).toBe(600);
    });
  });
});
